import { useEffect, useState } from "react";
import ContentBox from "../ContentBox/ContentBox";
import ResourceCounter from "../ResourceCounter/ResourceCounter";
import textToSprite from "../../util/textToSprite";
import nodesJSON from "../../data/nodes.json";
import type { NodeStatus } from "../../context/types";

const seedNodes = nodesJSON as NodeStatus[];
const API = "http://localhost:5000";

type Props = { nodeId: number };

const NodeDetails: React.FC<Props> = ({ nodeId }) => {
  const seed = seedNodes.find((node) => node.id === nodeId);
  const [node, setNode] = useState<NodeStatus | undefined>(seed);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number;
    const refresh = async () => {
      try {
        const response = await fetch(`${API}/nodes/${nodeId}`, { signal: controller.signal });
        if (response.ok) setNode(await response.json());
      } catch { /* MCP may be unavailable; keep the last known node */ }
      timer = window.setTimeout(refresh, 10000);
    };
    refresh();
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [nodeId]);

  if (!node) return null;
  const disk1 = node.disks[0];
  const disk2 = node.disks[1];
  const ramMax = node.ramGb ?? 1;
  const ramUsed = node.ramUsedGb ?? 0;

  return (
    <div className="panel-group">
      <ContentBox className="w-[894.8px] h-[720px] m-auto absolute top-[44px]" data-label="node">
        <div className="p-8">
          <div className="flex justify-between mb-6">
            <div>
              <p className="mb-2">{textToSprite(node.name)}</p>
              <p>{textToSprite(node.location || "Ávila")}</p>
              <p>{textToSprite(`IP ${node.ip ?? "—"}`)}</p>
            </div>
            <div className="text-right">
              <p>{textToSprite(node.status === "online" ? "CONECTADO" : node.status === "offline" ? "DESCONECTADO" : "SIN DATOS")}</p>
              <p>{textToSprite(`Nivel ${node.level}`, true)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <div><p>{textToSprite("Sistema")}</p><p>{textToSprite(node.os)}</p></div>
            <div><p>{textToSprite("CPU")}</p><p>{textToSprite(node.cpuPct == null ? "—" : `${node.cpuPct}%`, true)}</p></div>
            <div>
              <p>{textToSprite("RAM")}</p>
              <ResourceCounter label="mp" currentValue={ramUsed} maxValue={ramMax} accentColor="#63d9c1" />
              <p className="ml-8">{textToSprite(`${ramUsed} GB / ${ramMax} GB`)}</p>
            </div>
            <div>
              <p>{textToSprite("Agente")}</p>
              <p>{textToSprite(node.agent.enabled ? "ACTIVO" : "INACTIVO")}</p>
              {node.agent.name && <p>{textToSprite(node.agent.name)}</p>}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2">{textToSprite("Discos")}</p>
            <ResourceCounter label="hp" currentValue={disk1 ?? 0} maxValue={100} accentColor="#4f8fd4" />
            <p className="ml-8">{textToSprite(`Disco 1: ${disk1 == null ? "—" : `${disk1} GB`}`)}</p>
            {disk2 !== undefined && <>
              <ResourceCounter label="hp" currentValue={disk2 ?? 0} maxValue={100} accentColor="#4f8fd4" />
              <p className="ml-8">{textToSprite(`Disco 2: ${disk2 == null ? "—" : `${disk2} GB`}`)}</p>
            </>}
          </div>

          <div className="mt-6">
            <p className="mb-2">{textToSprite("Habilidades")}</p>
            <p>{textToSprite(node.skills.length ? node.skills.join(" · ") : "—")}</p>
          </div>
        </div>
      </ContentBox>
    </div>
  );
};

export default NodeDetails;
