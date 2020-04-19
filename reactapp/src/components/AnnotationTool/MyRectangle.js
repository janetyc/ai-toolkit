import React, { useEffect, useRef } from 'react'
import { Rect } from 'react-konva';

const MyRectangle = ( {x, y, width, height, name, stroke, onTransform} ) => {

  const rectRef = useRef();

  useEffect(() => {
    rectRef.current.getLayer().batchDraw();    
  }, []);

  const handleTransform = (event) => {

    const shape = event.target;
    
    shape.setAttrs({
      width: shape.width()*shape.scaleX(),
      height: shape.height()*shape.scaleY(),
      scaleX: 1.0, //reset scale
      scaleY: 1.0, //reset scale
    });

    //update back to rectangles
    onTransform({
      width: shape.width(),
      height: shape.height(),
      scaleX: shape.scaleX(),
      scaleY: shape.scaleY()
    });

  };
  const handleChange = (event) => {
    
    const shape = event.target;
    
    onTransform({
      x: shape.x(),
      y: shape.y()
    });
  };
  const handleMouseEnter = (event) => {
    const shape = event.target;
    shape.stroke('#ff4d4d');
    shape.getStage().container().style.cursor = 'move';
    // this.rect.draw();
    rectRef.current.getLayer().draw();
  };

  const handleMouseLeave = (event) => {
    const shape = event.target;
    shape.stroke('#cc0000');
    shape.getStage().container().style.cursor = 'crosshair';
    // this.rect.draw();
    rectRef.current.getLayer().draw();
  };

  return (
    <Rect
        ref={rectRef}
        x={x}
        y={y}
        width={width}
        height={height}
        
        scaleX={1}
        scaleY={1}
        stroke={stroke}
        strokeWidth={3}
        name={name}

        strokeScaleEnabled={false}
        
        // save state on dragend or transformend
        draggable
        onDragEnd={handleChange}
        onTransformEnd={handleTransform}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        
    />
  );
};
export default MyRectangle;