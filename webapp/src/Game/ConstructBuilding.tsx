import React from "react";
import { useNavigate } from "react-router-dom";
import { classnames } from "tailwindcss-classnames";
import { Building } from "../generated/building";
import { useStore } from "../store";
import styles from "../styles";
import {
  countBuildings,
  countBuildingsUnderConstruction,
  formatDurationShort,
  isNotNull,
} from "../utils";
import PlaceholderImage from "./PlaceholderImage";
import { ReactComponent as SvgKitchen } from "../../images/kitchen.svg";
import { ReactComponent as SvgShop } from "../../images/shop.svg";
import { ReactComponent as SvgHouse } from "../../images/house.svg";
import { ReactComponent as SvgSchool } from "../../images/school.svg";
import { ReactComponent as SvgMarketingHQ } from "../../images/marketing-hq.svg";
import { ReactComponent as SvgResearchInstitute } from "../../images/research-institute.svg";

const title = classnames("text-lg", "md:text-xl", "mb-2");
const label = classnames("text-xs", "md:text-sm", "mr-1");
const value = classnames("text-sm", "md:text-lg", "ml-1");

const svgs: Record<
  Building,
  React.VFC<React.SVGProps<SVGSVGElement>> | undefined
> = {
  [Building.KITCHEN]: SvgKitchen,
  [Building.SHOP]: SvgShop,
  [Building.HOUSE]: SvgHouse,
  [Building.SCHOOL]: SvgSchool,
  [Building.MARKETINGHQ]: SvgMarketingHQ,
  [Building.RESEARCH_INSTITUTE]: SvgResearchInstitute,
};

type Props = {
  lotId: string;
};

const toBuildingId = (key: string) => {
  const n = Number(key);
  if (n in Building) {
    return n as Building;
  }

  return null;
};

const numberFormat = new Intl.NumberFormat();

const ConstructBuilding = ({ lotId }: Props) => {
  const constructBuilding = useStore((state) => state.constructBuilding);
  const buildings = useStore((state) => state.gameData?.buildings) ?? [];
  const coins = useStore((state) => state.gameState.resources.coins);
  const lots = useStore((state) => state.gameState.lots);
  const constructionQueue = useStore(
    (state) => state.gameState.constructionQueue
  );
  const navigate = useNavigate();

  const buildingCounts = countBuildings(lots);
  const buildingConstrCounts = countBuildingsUnderConstruction(
    constructionQueue
  );

  const onSelectClick = (e: React.MouseEvent, building: Building) => {
    e.preventDefault();
    constructBuilding(lotId, building);
    navigate("/town");
  };

  return (
    <div
      className={classnames("container", "mx-auto", "mt-4", "px-1", "max-w-xl")}
    >
      <h2>Construct Building</h2>
      {Object.keys(buildings)
        .map(toBuildingId)
        .filter(isNotNull)
        .map((id) => {
          let discountText: string | null = null;
          let discountCost: number | null = null;
          let reducedTime: number | null = null;

          // First construction of all building types are free except for
          // marketing hq and research institute
          if (
            id !== Building.MARKETINGHQ &&
            id !== Building.RESEARCH_INSTITUTE &&
            buildingCounts[id] + buildingConstrCounts[id] === 0
          ) {
            discountCost = 0;
            discountText = "First one is free and fast!";
            reducedTime = Math.ceil(
              buildings[id].levelInfos[0].constructionTime / 100
            );
          }

          // Can only build one school, marketing hq, and research institute
          if (
            (id === Building.SCHOOL && buildingCounts[id] > 0) ||
            (id === Building.MARKETINGHQ && buildingCounts[id] > 0) ||
            (id === Building.RESEARCH_INSTITUTE && buildingCounts[id] > 0)
          ) {
            return null;
          }

          const canAfford =
            coins >= (discountCost ?? buildings[id].levelInfos[0].cost);

          const SvgImage = svgs[id] || PlaceholderImage;

          return (
            <div
              className={classnames("flex", "flex-wrap", "gap-4", "mb-8")}
              key={id}
            >
              <div className={classnames("w-40", "h-28", "md:w-60", "md:h-40")}>
                <SvgImage className="w-full h-full" />
              </div>
              <div className={classnames("ml-4")}>
                <div className={title}>{buildings[id].title}</div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span className={label}>Cost:</span>
                      </td>
                      <td>
                        <span className={value}>
                          {discountCost !== null ? (
                            <>
                              <span
                                className={classnames(
                                  "line-through",
                                  "mr-2",
                                  "text-sm"
                                )}
                              >
                                {numberFormat.format(
                                  buildings[id].levelInfos[0].cost
                                )}{" "}
                                coins
                              </span>
                              <span>{discountCost} coins</span>
                            </>
                          ) : (
                            <span>
                              {numberFormat.format(
                                buildings[id].levelInfos[0].cost
                              )}{" "}
                              coins
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className={label}>Build time:</span>
                      </td>
                      <td>
                        <span className={value}>
                          {reducedTime !== null ? (
                            <>
                              <span
                                className={classnames(
                                  "line-through",
                                  "mr-2",
                                  "text-sm"
                                )}
                              >
                                {buildings[id].levelInfos[0].constructionTime}s
                              </span>
                              <span>{formatDurationShort(reducedTime)}</span>
                            </>
                          ) : (
                            <span>
                              {formatDurationShort(
                                buildings[id].levelInfos[0].constructionTime
                              )}
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={classnames("my-2")}>
                  <div>
                    {discountText && (
                      <span
                        className={classnames(
                          "mx-4",
                          "text-sm",
                          "text-red-800"
                        )}
                      >
                        {discountText}
                      </span>
                    )}
                    {!canAfford && (
                      <span
                        className={classnames(
                          "mx-4",
                          "text-sm",
                          "text-red-800"
                        )}
                      >
                        Not enough coins
                      </span>
                    )}
                  </div>
                  <button
                    className={classnames(styles.primaryButton)}
                    onClick={(e) => onSelectClick(e, id)}
                    disabled={!canAfford}
                  >
                    Place Building
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ConstructBuilding;
