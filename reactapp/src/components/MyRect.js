import React from 'react'
import { Rect } from 'react-konva';

const MyRect = ( {x, y, width, height, stroke, name} ) => {

  return (
    <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        
        scaleX={1}
        scaleY={1}
        stroke={stroke}
        strokeWidth={2}
        name={name}
        
        // save state on dragend or transformend
        // onDragEnd={handleChange}
        // onTransformEnd={handleChange}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        // draggable
        // ref={(node) => {
        //   this.rect = node;
        // }}
    />
  );
};
export default MyRect;