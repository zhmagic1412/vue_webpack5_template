import { ProjectHttp } from "@/utils/http";
import { Recordable } from "types";
import { adminUrl } from "./base-url";

export const test = (data?: Recordable)=> {
  return ProjectHttp.service(adminUrl, {
    url: "/test",
    method: "get",
  });
}
