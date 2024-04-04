/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { AzExtParentTreeItem } from "@microsoft/vscode-azext-utils";
import { LogicAppVersionTreeItem } from "./LogicAppVersionTreeItem";
import { localize } from "../../../../localize";
import { getThemedIconPath } from "../../../utils/tree/assets";

export class LogicAppVersionsTreeItem extends AzExtParentTreeItem {
    public static contextValue = "azLogicAppsWorkflowVersions";
    public readonly childTypeLabel = localize("azLogicApps.Version", "Version");
    public readonly contextValue = LogicAppVersionsTreeItem.contextValue;
    public readonly label = localize("azLogicApps.Versions", "Versions");
    private readonly workflow: any;
    private readonly client: any;

    private nextLink: string | undefined;

    public constructor(parent: any, workflow: any) {
        super(parent);
        this.workflow = workflow;
    }

    public hasMoreChildrenImpl(): boolean {
        return this.nextLink !== undefined;
    }

    public get iconPath() {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.workflow.id}/versions`;
    }

    public get resourceGroupName(): string {
        return this.workflow.id.split("/").slice(-5, -4)[0];
    }

    public get workflowName(): string {
        return this.workflow.name;
    }

    public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const workflowVersions = this.nextLink === undefined
            ? await this.client.workflowVersions.list(this.resourceGroupName, this.workflowName)
            : await this.client.workflowVersions.listNext(this.nextLink);

        this.nextLink = workflowVersions.nextLink;

        return workflowVersions.map((workflowVersion: WorkflowVersion) => {
            return workflowVersion.name === this.workflow.version
                ? new LogicAppCurrentVersionTreeItem(this.client, this.workflow, workflowVersion)
                : new LogicAppVersionTreeItem(this.client, this.workflow, workflowVersion);
        });
    }
}
