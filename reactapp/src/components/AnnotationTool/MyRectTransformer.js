import React, { useEffect, useRef } from 'react'
import { Transformer} from 'react-konva';

function MyRectTransformer( {selectedShapeName} ) {
  
  const trRef = useRef();
  
  useEffect(() => {
    const stage = trRef.current.getStage();
    const selectedNode = stage.findOne(`.${selectedShapeName}`);

    // do nothing if selected node is already attached
    if (selectedNode === trRef.current.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      trRef.current.attachTo(selectedNode);
    } else {
      // remove transformer
      trRef.current.detach();
    }
    trRef.current.getLayer().batchDraw();

  }, [selectedShapeName]);

  return (
    <Transformer
        ref={trRef}
        ignoreStroke
        rotateEnabled={false}
    />
  );
};
export default MyRectTransformer;