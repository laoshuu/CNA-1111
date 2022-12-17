import React from "react";
import { Button } from 'antd';

function FilterButton(props) {
  return (
    <Button
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span >Show </span>
      <span>{props.name}</span>
      <span >tasks</span>
    </Button>
  );
}

export default FilterButton;
