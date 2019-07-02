import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import cx from "classnames"
import { createDeepLinkPath, escapeDeepLinkPath, sanitizeUrl } from "core/utils"

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  static propTypes = {
    tagObj: ImPropTypes.map.isRequired,
    tag: PropTypes.string.isRequired,

    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    children: PropTypes.element,
  }

  render() {
    const {
      tagObj,
      tag,
      children,

      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
    } = this.props

    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown")
    const DeepLink = getComponent("DeepLink")
    const Link = getComponent("Link")
    const Button = getComponent("Button")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
    let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
    let tagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])

    let isShownKey = ["operations-tag", tag]
    let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

    return (
      <div className={cx("opblock-tag-section", { "is-open": showTag })}>
        <div
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }
          id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}
          data-tag={tag}
          data-is-open={showTag}
          >
          <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={showTag}
            path={createDeepLinkPath(tag)}
            text={tag} />
          { !tagDescription ? <small></small> :
            <small>
                <Markdown source={tagDescription} />
              </small>
            }

            <div>
              { !tagExternalDocsDescription ? null :
                <small>
                    { tagExternalDocsDescription }
                      { tagExternalDocsUrl ? ": " : null }
                      { tagExternalDocsUrl ?
                        <Link
                            href={sanitizeUrl(tagExternalDocsUrl)}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            >{tagExternalDocsUrl}</Link> : null
                          }
                  </small>
                }
            </div>

          <Button
            className="sui-btn-transparent expand-operation"
            title={showTag ? "Collapse operation": "Expand operation"}
            onClick={() => layoutActions.show(isShownKey, !showTag)}
            unstyled
          >
            <svg className="arrow" width="20" height="20">
              <use
                href={showTag ? "#large-arrow-down" : "#large-arrow"}
                xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"}
              />
            </svg>
          </Button>
        </div>

        <Collapse isOpened={showTag}>
          {children}
        </Collapse>
      </div>
    )
  }
}
