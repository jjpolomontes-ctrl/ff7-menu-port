import ContentBox from "../../components/ContentBox/ContentBox";
import PartyList from "../../components/PartyList/PartyList";
import Time from "../../components/Time/Time";
import textToSprite from "../../util/textToSprite";
import styles from "./Landing.module.scss";

function LandingContent() {
  return (
    <div className="panel-group">
      <ContentBox className="w-[894.8px] h-[720px] m-auto absolute top-[44px]" data-label="party">
        <PartyList />
      </ContentBox>
      <ContentBox className="w-[280px] h-[110px] m-auto absolute right-0 bottom-[94.2px]" data-label="metaInfo">
        <ul className="flex justify-between flex-col h-full">
          <li className="flex justify-between"><span>{textToSprite("Tiempo")}</span><Time /></li>
          <li className="flex justify-between"><span>{textToSprite("Estado")}</span><span>{textToSprite("MCP", true)}</span></li>
        </ul>
      </ContentBox>
      <ContentBox className={`${styles.pageInfo} w-[535px] h-[88px] m-auto absolute right-0 top-0 flex items-center justify-between`} data-label="pageInfo">
        <span>{textToSprite("Ávila")}</span>
        <span className="font-glyph" data-sprite="reset-icon" aria-hidden="true"></span>
      </ContentBox>
    </div>
  );
}

export default LandingContent;
