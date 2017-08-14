import { style, state, animate, transition, keyframes, AnimationMetadata } from '@angular/animations';

import { AnimationType } from './animation-type';

export const pageTransitionAnimate: AnimationMetadata[] = [
    state(AnimationType.SlideOutLeft, style({
    transform: 'translateX(-30%)'
})), state(AnimationType.SlideOutRight, style({
    transform: 'translateX(30%)'
})), state(AnimationType.SlideOutUp, style({
    transform: 'translateY(-100%)'
})), state(AnimationType.SlideOutDown, style({
    transform: 'translateY(100%)'
})), state(AnimationType.FadeOutLeft, style({
    transform: 'translateX(-30%)',
    opacity: 0.5
})), state(AnimationType.FadeOutRight, style({
    transform: 'translateX(30%)',
    opacity: 0.5
})), state(AnimationType.FadeOutUp, style({
    transform: 'translateY(-100%)',
    opacity: 0.5
})), state(AnimationType.FadeOutDown, style({
    transform: 'translateY(100%)',
    opacity: 0.5
})), state(AnimationType.ZoomOutLeft, style({
    display: 'none'
})), state(AnimationType.ZoomOutRight, style({
    display: 'none'
})), state(AnimationType.ZoomOutUp, style({
    display: 'none'
})), state(AnimationType.ZoomOutDown, style({
    display: 'none'
})), transition('* => ' + AnimationType.SlideInRight, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateX(100%)',
        offset: 0
    }),
    style({
        transform: 'translateX(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideInLeft, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateX(-30%)',
        offset: 0
    }),
    style({
        transform: 'translateX(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideOutRight, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateX(0)',
        offset: 0
    }),
    style({
        transform: 'translateX(100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideOutLeft, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateX(0)',
        offset: 0
    }),
    style({
        transform: 'translateX(-30%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideInUp, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateY(100%)',
        offset: 0
    }),
    style({
        transform: 'translateY(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideOutUp, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateY(0)',
        offset: 0
    }),
    style({
        transform: 'translateY(-100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideInDown, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateY(-100%)',
        offset: 0
    }),
    style({
        transform: 'translateY(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.SlideOutDown, animate('250ms ease-out', keyframes([
    style({
        transform: 'translateY(0)',
        offset: 0
    }),
    style({
        transform: 'translateY(100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeInLeft, animate('250ms ease-out', keyframes([
    style({
        opacity: 0.5,
        transform: 'translateX(-30%)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateY(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeOutLeft, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateX(0)',
        offset: 0
    }),
    style({
        opacity: 0.5,
        transform: 'translateX(-30%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeInRight, animate('250ms ease-out', keyframes([
    style({
        opacity: 0.5,
        transform: 'translateX(100%)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateX(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeOutRight, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateX(0)',
        offset: 0
    }),
    style({
        opacity: 0.5,
        transform: 'translateX(100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeInUp, animate('250ms ease-out', keyframes([
    style({
        opacity: 0.5,
        transform: 'translateY(100%)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateY(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeOutUp, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateY(0)',
        offset: 0
    }),
    style({
        opacity: 0.5,
        transform: 'translateY(-100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeInDown, animate('250ms ease-out', keyframes([
    style({
        opacity: 0.5,
        transform: 'translateY(-100%)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateY(0)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.FadeOutDown, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateY(0)',
        offset: 0
    }),
    style({
        opacity: 0.5,
        transform: 'translateY(100%)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomInLeft, animate('300ms', keyframes([
    style({
        opacity: 0,
        transform: 'translateX(-100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0
    }),
    style({
        opacity: .6,
        transform: 'translateX(10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 0.6
    }),
    style({
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomOutLeft, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateX(10%) scale(.475)',
        offset: 0.4
    }),
    style({
        opacity: 0,
        transform: 'translateX(-100%) scale(.1)',
        transformOrigin: 'left center',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomInRight, animate('250ms', keyframes([
    style({
        opacity: 0,
        transform: 'translateX(100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0
    }),
    style({
        opacity: .6,
        transform: 'translateX(-10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 0.6
    }),
    style({
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomOutRight, animate('250ms ease-out', keyframes([
    style({
        opacity: 1,
        transform: 'translateX(-10%) scale(.475)',
        offset: 0.4
    }),
    style({
        opacity: 0,
        transform: 'translateX(100%) scale(.1)',
        transformOrigin: 'right center',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomInUp, animate('250ms', keyframes([
    style({
        opacity: 0,
        transform: 'translateY(100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateY(-10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 0.6
    }),
    style({
        transform: 'translateY(0) scale(1)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomOutUp, animate('250ms', keyframes([
    style({
        opacity: 1,
        transform: 'translateY(-10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0.4
    }),
    style({
        opacity: 0,
        transform: 'translateY(100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomInDown, animate('250ms', keyframes([
    style({
        opacity: 0,
        transform: 'translateY(-100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0
    }),
    style({
        opacity: 1,
        transform: 'translateY(10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 0.6
    }),
    style({
        transform: 'translateY(0) scale(1)',
        offset: 1
    })
]))), transition('* => ' + AnimationType.ZoomOutDown, animate('250ms', keyframes([
    style({
        opacity: 1,
        transform: 'translateY(10%) scale(.475)',
        animationTimingFunction: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        offset: 0.4
    }),
    style({
        opacity: 0,
        transform: 'translateY(-100%) scale(.1)',
        animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.320, 1)',
        offset: 1
    })
])))];