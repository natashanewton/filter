import { TeamsView } from "@twilio/flex-ui";
import { DepartmentFilter } from "./DepartmentFilter";
import { HierarchyFilter } from "./DepartmentFilter";
import { AgentFilter } from "./DepartmentFilter";
export const extendFilter = (flex, manager) => {
    
    const worker_team_id = flex.Manager.getInstance().workerClient.attributes.team_id;
    flex.TeamsView.defaultProps.hiddenFilter = 'data.attributes.team_id=="'+worker_team_id+'"'
    
    manager.updateConfig({
        componentProps: {
            TeamsView: {
                filters:[
                    TeamsView.activitiesFilter,
                    DepartmentFilter,
                    HierarchyFilter,
                    AgentFilter,
                ],                
            }
        }
    })
};