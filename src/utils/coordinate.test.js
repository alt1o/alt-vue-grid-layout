export default function autoMove(that, layout){
    that.coors.moveItemTo(layout[6], {
        x: layout[6].x,
        y: layout[6].y - 1
    })
    for(let i = 4; i > 0; i--){
        that.coors.moveItemTo(layout[3], {
            x: layout[3].x - 1,
            y: layout[3].y
        })
    }
    for(let i = 4; i > 0; i--){
        that.coors.moveItemTo(layout[3], {
            x: layout[3].x + 1,
            y: layout[3].y
        })
    }
    that.coors.moveItemTo(layout[0], {
        x: layout[0].x + 1,
        y: layout[0].y
    })
    that.coors.moveItemTo(layout[0], {
        x: layout[0].x + 1,
        y: layout[0].y
    })
    // that.coors.moveItemTo(layout[2], {
    //     x: layout[2].x - 1,
    //     y: layout[2].y
    // })
    // that.coors.moveItemTo(layout[2], {
    //     x: layout[2].x - 1,
    //     y: layout[2].y
    // })
    // for(let i = 3; i > 0; i--){
    //     that.coors.moveItemTo(layout[3], {
    //         x: layout[3].x - 1,
    //         y: layout[3].y
    //     })
    // }
}