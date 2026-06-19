import { useProject } from "../../context/project"
import { useSync } from "../../context/sync"
import { createMemo, Show } from "solid-js"
import { useTheme } from "../../context/theme"
import { WorkspaceLabel } from "../../component/workspace-label"
import { usePluginRuntime } from "../../plugin/runtime"

export function Sidebar(props: { sessionID: string }) {
  const pluginRuntime = usePluginRuntime()
  const project = useProject()
  const sync = useSync()
  const { theme } = useTheme()
  const session = createMemo(() => sync.session.get(props.sessionID))
  const workspace = () => {
    const workspaceID = session()?.workspaceID
    if (!workspaceID) return
    return project.workspace.get(workspaceID)
  }

  return (
    <Show when={session()}>
      <box flexDirection="row" gap={2} alignItems="center" flexShrink={1} flexGrow={1}>
        <pluginRuntime.Slot
          name="sidebar_title"
          mode="single_winner"
          session_id={props.sessionID}
          title={session()!.title}
          share_url={session()!.share?.url}
        >
          <box flexDirection="row" gap={1} alignItems="center" flexGrow={1} flexShrink={1}>
            <text fg={theme.text} wrapMode="none" flexShrink={1}>
              <b>{session()!.title}</b>
            </text>
            <Show when={session()!.workspaceID}>
              <Show
                when={workspace()}
                fallback={<WorkspaceLabel type="unknown" name={session()!.workspaceID!} status="error" icon />}
              >
                {(item) => (
                  <WorkspaceLabel
                    type={item().type}
                    name={item().name}
                    status={project.workspace.status(item().id) ?? "error"}
                    icon
                  />
                )}
              </Show>
            </Show>
          </box>
        </pluginRuntime.Slot>
        <box flexDirection="row" gap={1} alignItems="center" flexShrink={0}>
          <pluginRuntime.Slot name="sidebar_content" session_id={props.sessionID} />
        </box>
      </box>
    </Show>
  )
}
