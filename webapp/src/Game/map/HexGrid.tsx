import React from "react";
import classNames from "classnames";
import { ReactComponent as TownSvg } from "../../../images/town.svg";

import style from "./hexgrid.module.css";
import { WorldZone } from "../../generated/world";

type Props = {
  x: number;
  y: number;
  size: number;
  data: WorldZone[];
  onNavigate: (x: number, y: number) => void;
};

const range = (from: number, to: number) => [
  ...[...Array(to - from).keys()].map((i) => from + i),
];

const Arrow: React.FC<{
  dir: "top" | "left" | "bottom" | "right";
  onNavigate: (x: number, y: number) => void;
}> = ({ dir, onNavigate }) => {
  const onClick = () => {
    switch (dir) {
      case "top":
        onNavigate(0, -1);
        break;
      case "right":
        onNavigate(1, 0);
        break;
      case "bottom":
        onNavigate(0, 1);
        break;
      case "left":
        onNavigate(-1, 0);
        break;
    }
  };
  return (
    <div
      className={`${style.arrow} ${style["arrow" + dir]}`}
      onClick={onClick}
    />
  );
};

const HexGrid: React.FC<Props> = ({ data, x, y, size, onNavigate }) => {
  const sh2floor = Math.floor(size / 2);
  const sh2round = Math.round(size / 2);
  return (
    <div className={style.root}>
      {range(y - sh2floor, y + sh2round).map((y) => (
        <div className={style.row} key={y}>
          {range(x - sh2floor, x + sh2round).map((x) => {
            const zidx = Math.floor(y / 10) * 10 + Math.floor(x / 10);
            const eidx = (y % 10) * 10 + (x % 10);
            const entry = data[zidx]?.entries[eidx];
            const objectType = entry?.object?.oneofKind;
            return (
              <div
                className={classNames(
                  style.tile,
                  style.grass,
                  objectType && style[objectType]
                )}
                key={x}
              >
                {objectType === "town" && (
                  <TownSvg style={{ width: "100%", height: "100%" }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <Arrow dir="top" onNavigate={onNavigate} />
      <Arrow dir="right" onNavigate={onNavigate} />
      <Arrow dir="bottom" onNavigate={onNavigate} />
      <Arrow dir="left" onNavigate={onNavigate} />
    </div>
  );
};

export default HexGrid;