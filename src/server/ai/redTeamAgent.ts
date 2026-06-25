import { Roadmap, UserRequest, RiskReport } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Identifies semantic and real-world vulnerabilities that pure mathematics cannot detect.
 */
export async function executeRedTeamAgent(roadmap: Roadmap, originalRequest: UserRequest): Promise<RiskReport> {
  throw new NotImplementedError("Red Team Agent execution is deferred to Phase 2.");
}
