import type { Chapter } from "@demo/engine/actions";
import { register } from "./01-register";
import { booking } from "./02-booking";
import { consultant } from "./03-consultant";
import { manager } from "./04-manager";
import { evaluation } from "./05-evaluation";
import { approval } from "./06-approval";
import { report } from "./07-report";
import { plan } from "./08-plan";
import { tracking } from "./09-tracking";
import { program } from "./10-program";
import { accounting } from "./11-accounting";
import { session } from "./12-session";
import { generalization } from "./13-generalization";
import { parent } from "./14-parent";

export const chapters: Chapter[] = [register, booking, consultant, manager, evaluation, approval, report, plan, tracking, program, accounting, session, generalization, parent];
