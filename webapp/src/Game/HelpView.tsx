import React from "react";
import { useLocalStorage } from "react-use";
import { classnames } from "tailwindcss-classnames";
import howToConstructBuildingImage from "../../images/how-to-construct-building-1.jpg";
import howToEducate1Image from "../../images/how-to-educate-1.jpg";
import howToEducate2Image from "../../images/how-to-educate-2.jpg";

const HelpView: React.VFC<{}> = () => {
  const [hasSeenHelpPage, setHasSeenHelpPage] = useLocalStorage(
    "hasSeenHelpPage",
    false
  );
  if (!hasSeenHelpPage) {
    setHasSeenHelpPage(true);
  }

  return (
    <div
      className={classnames("flex", "items-center", "flex-col", "mt-2", "p-2")}
    >
      <h2>Game Help</h2>

      <article className={classnames("text-gray-800", "p-4")}>
        <section>
          <h3>Introduction</h3>
          <p>
            You are in charge of building and expanding your town by building
            and assigning roles to your mice population. Your pizza empire will
            earn coins by selling pizzas. The player with the most coins is
            proclaimed as the winner.
          </p>

          <p>
            To keep your profits intact, you must train part of your population
            as security guards to protect yourself from being robbed by other
            players. And maybe, you join the dirty game yourself and send
            thieves on your competitors!
          </p>

          <p>You should start of by constructing some buildings:</p>
          <ul
            className={classnames("list-disc", "list-inside", "ml-4", "my-2")}
          >
            <li>A house &mdash; so that mice will move in to your town</li>
            <li>A school &mdash; so that you can educate your mice</li>
            <li>A kitchen &mdash; so that your chefs can bake pizzas</li>
            <li>
              A shop &mdash; so that your salesmice can sell pizzas and earn you
              coins
            </li>
          </ul>
        </section>

        <section>
          <h3>How to construct buildings</h3>
          <p>
            Simple click/tap an empty lot in your town to navigate to the
            construction page. From there you can select the building you want
            to build.
            <img
              src={howToConstructBuildingImage}
              className={classnames(
                "border-2",
                "border-green-300",
                "w-5/6",
                "filter",
                "hue-rotate-15",
                "my-2",
                "max-w-sm"
              )}
            />
          </p>
        </section>

        <section>
          <h3>How to educate mice</h3>
          <p>
            First things first, make sure you have some population in your town
            that can be educated. Use the population menu on your{" "}
            <em>Town page</em>. Simple click/tap an empty lot in your town to
            navigate to the construction page. From there you can select the
            building you want to build.
            <img
              src={howToEducate1Image}
              className={classnames(
                "border-2",
                "border-green-300",
                "w-5/6",
                "filter",
                "hue-rotate-15",
                "my-2",
                "max-w-sm"
              )}
            />
            If your <em>Uneducated</em> column shows 0, then you need to
            construct a <em>House</em>.
          </p>

          <p>
            Now that you have population to educate, start by navigating to your{" "}
            <em>School</em>:
            <img
              src={howToEducate2Image}
              className={classnames(
                "border-2",
                "border-green-300",
                "w-5/6",
                "filter",
                "hue-rotate-15",
                "my-2",
                "max-w-sm"
              )}
            />
            If your don't have a school, then you need to build one one an empty
            lot.
          </p>
        </section>
      </article>
    </div>
  );
};

export default HelpView;
