// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-dnd

import {Injectable} from 'angular2/core';
import {Directive, Input, Output, EventEmitter, ElementRef} from 'angular2/core';

import {DragDropConfig, AbstractDraggableDroppableComponent, DragDropZonesService} from './dnd.common';

@Injectable()
export class DragDropDataService {
    onDragSuccessCallback: EventEmitter<any>;
    draggableData: any;
}

@Injectable()
export class DragDropConfigService {
    dragDropConfig: DragDropConfig = new DragDropConfig();
    sortableConfig: DragDropConfig = new DragDropConfig();
}

@Directive({ selector: '[dnd-draggable]' })
export class DraggableComponent extends AbstractDraggableDroppableComponent {

    /**
     * Whether the object is draggable. Default is true.
     */
    @Input() dragEnabled: boolean;

    /**
     * The data that has to be dragged. It can be any JS object
     */
    @Input() draggableData: any;

    //ddConfig: DragDropConfig;

    /**
     * An instance of DragDropConfig class. It permits to configure how the drag&drop look&feel
     * (cursor, drag image, custom classes to add on drag/drop events)
     */
    @Input() set dragdropConfig(value: DragDropConfig) {
        this.config = value;
    }

    /**
     * Callback function called when the drag action ends with a valid drop action.
     * It is activated after the on-drop-success callback
     */
    @Output("onDragSuccess") onDragSuccessCallback: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Array of Strings. Specify the drop-zones to which this component can drop.
     */
    @Input() set dropZones(value: Array<string>) {
        this.dropZoneNames = value;
    }

    constructor(elemRef: ElementRef, ddZonesService: DragDropZonesService, public dragDropService: DragDropDataService, dragDropConfigService: DragDropConfigService) {
        super(elemRef, ddZonesService, dragDropConfigService.dragDropConfig);
        this.dragdropConfig = dragDropConfigService.dragDropConfig;
        this.dragEnabled = true;
        // Test
        // this.onDragSuccessCallback.subscribe((value:any) => {
        //     console.log("value", value);
        // });
    }

    onDragStartCallback = (event: Event) => {
        this.dragDropService.draggableData = this.draggableData;
        this.dragDropService.onDragSuccessCallback = this.onDragSuccessCallback;
        let dragTarget: HTMLElement = <HTMLElement>event.target;
        dragTarget.classList.add(this.config.onDragStartClass);
    };
    
    onDragEndCallback = (event: Event) => {
        this.dragDropService.draggableData = null;
        this.dragDropService.onDragSuccessCallback = null;
        let dragTarget: HTMLElement = <HTMLElement>event.target;
        dragTarget.classList.remove(this.config.onDragStartClass);
    }
}