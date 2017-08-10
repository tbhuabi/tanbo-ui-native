export enum AnimationType {
    SlideInLeft = 'SlideInLeft',
    SlideOutLeft = 'SlideOutLeft',
    SlideInRight = 'SlideInRight',
    SlideOutRight = 'SlideOutRight',
    SlideInUp = 'SlideInUp',
    SlideOutUp = 'SlideOutUp',
    SlideInDown = 'SlideInDown',
    SlideOutDown = 'SlideOutDown',
    FadeInLeft = 'FadeInLeft',
    FadeOutLeft = 'FadeOutLeft',
    FadeInRight = 'FadeInRight',
    FadeOutRight = 'FadeOutRight',
    FadeInUp = 'FadeInUp',
    FadeOutUp = 'FadeOutUp',
    FadeInDown = 'FadeInDown',
    FadeOutDown = 'FadeOutDown',
    ZoomInLeft = 'ZoomInLeft',
    ZoomOutLeft = 'ZoomOutLeft',
    ZoomInRight = 'ZoomInRight',
    ZoomOutRight = 'ZoomOutRight',
    ZoomInUp = 'ZoomInUp',
    ZoomOutUp = 'ZoomOutUp',
    ZoomInDown = 'ZoomInDown',
    ZoomOutDown = 'ZoomOutDown'
}

export interface PageTransition {
    activate: AnimationType;
    reactivate: AnimationType;
    destroy: AnimationType;
    toStack: AnimationType;
}
