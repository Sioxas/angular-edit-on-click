import {
    Directive,
    HostListener,
    OnInit,
    ElementRef,
    ComponentRef,
    Input,
    Output,
    EventEmitter,
    Injector,
    Type,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { InputComponent } from './input.component';
import { INPUT_PORTAL_DATA } from './injection-token';
import { EditOnClickConfig, InputComponentConfig } from './common';
import { MinmaxInputComponent } from './minmax-input.component';
import { SelectInputComponent } from './select-input.component';

@Directive({
    selector: '[editOnClick]'
})
export class EditOnClickDirective implements OnInit {
    @Input() editOnClick;
    @Input() editOnClickConfig?: EditOnClickConfig;
    @Output() editOnClickChange = new EventEmitter();
    overlayRef: OverlayRef;
    constructor(private el: ElementRef, private overlay: Overlay, private injector: Injector) { }

    ngOnInit(): void {
        const strategy = this.overlay.position().connectedTo(
            this.el,
            { originX: 'center', originY: 'center' },
            { overlayX: 'center', overlayY: 'center' }
        );
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            positionStrategy: strategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
    }

    @HostListener('click') onClick() {
        if (this.editOnClickConfig && this.editOnClickConfig.editable === false) return;
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        } else {
            const componentRef = this.overlayRef.attach(this.createComponentPortal());
            const componentInstance = componentRef.instance;
            let editValue = this.editOnClick;

            componentInstance.valueChange.subscribe(value => {
                editValue = value;
            });
            componentInstance.submit.subscribe(value => {
                this.editOnClickChange.emit(value);
                this.overlayRef.detach();
            });
            componentInstance.cancel.subscribe(() => {
                this.overlayRef.detach();
            });
            this.overlayRef.backdropClick().subscribe(() => {
                componentInstance.valid && this.editOnClickChange.emit(editValue);
                this.overlayRef.detach();
            });
        }
    }

    private createInjector(data: any, config: EditOnClickConfig): PortalInjector {
        const injectorTokens = new WeakMap<any, InputComponentConfig>([
            [INPUT_PORTAL_DATA, { initialValue: data, config }],
        ]);
        return new PortalInjector(this.injector, injectorTokens);
    }

    private createComponentPortal(): ComponentPortal<any> {
        const config = this.editOnClickConfig;
        if (config) {
            switch (config.type) {
                case 'password':
                case 'number':
                case 'text': return this.componentPortalFactory<InputComponent>(InputComponent);
                case 'minmax': return this.componentPortalFactory<MinmaxInputComponent>(MinmaxInputComponent);
                case 'select': return this.componentPortalFactory<SelectInputComponent>(SelectInputComponent);
                case 'time':
                case 'datetime':
                default: return this.componentPortalFactory<InputComponent>(InputComponent);
            }
        } else {
            return this.componentPortalFactory<InputComponent>(InputComponent);
        }
    }

    private componentPortalFactory<T>(component: Type<any>): ComponentPortal<T> {
        return new ComponentPortal<T>(
            component,
            undefined,
            this.createInjector(this.editOnClick, this.editOnClickConfig)
        );
    }
}
