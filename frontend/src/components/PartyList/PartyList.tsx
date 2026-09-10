import { Link } from "react-router-dom";
import ResourceCounter from "../ResourceCounter/ResourceCounter";
import Portrait from "../Portrait/Portrait";
import textToSprite from "../../util/textToSprite";
import nodesJSON from "../../data/nodes.json";
import type { NodeStatus } from "../../context/types";

const nodes = nodesJSON as NodeStatus[];

const PartyList: React.FC = () => (
  <div className="flex flex-col gap-7 p-8">
    {nodes.map((node) => (
      <Link key={node.id} to={`/node/${node.id}`} className="flex items-start gap-8" title={`Ver ${node.name}`}>
        <Portrait src={node.image_path} width={125} look={null} blink={false} />
        <div className="mt-2 min-w-0 flex-1">
          <div className="flex justify-between">
            <p>{textToSprite(node.name)}</p>
            <p>{textToSprite(node.status === "online" ? "ONLINE" : node.status === "offline" ? "OFFLINE" : "MCP", false)}</p>
          </div>
          <p className="flex mb-1"><span className="font-glyph" data-sprite="lv">lv</span>{textToSprite(node.level.toString(), true)}</p>
          <p>{textToSprite(node.location)}</p>
          <p>{textToSprite(`IP ${node.ip ?? "—"}`)}</p>
          <ResourceCounter label="hp" maxValue={100} currentValue={node.disks[0] ?? 0} accentColor="#4f8fd4" />
          <ResourceCounter label="mp" maxValue={node.ramGb ?? 1} currentValue={node.ramUsedGb ?? 0} accentColor="#63d9c1" />
        </div>
      </Link>
    ))}
  </div>
);

export default PartyList;
