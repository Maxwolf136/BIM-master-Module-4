import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import { frameId } from "three/examples/jsm/nodes/Nodes.js"
import * as WEBIFC from "web-ifc"



type QtoResult = {[setName: string]: {[qtoName: string]: number}}


export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable {
    static uuid = "8b726a6a-d3ac-43ea-889d-8647fd39e0f9" 
    enabled: boolean =  true
    private _components: OBC.Components
    private _qtoResult: QtoResult = {}
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow

    }>();

    async setup() {
      const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
      highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        this.sumQuantities(fragmentIdMap)
      })
    }
    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this.setUI()
      }
    
      private setUI() {
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"
    
        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Mängduttag"
        this._components.ui.add(qtoList) 
        qtoList.visible = false // hidden by default 
    
        activationBtn.onClick.add(() => {
          activationBtn.active = !activationBtn.active
          qtoList.visible = activationBtn.active
        })
    
        this.uiElement.set({activationBtn, qtoList})
      }
    
      async dispose() {
        this.uiElement.dispose()
      }

      async sumQuantities(fragmentIdMap: OBC.FragmentIdMap) {
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentID in fragmentIdMap) {
          const fragment = fragmentManager.list[fragmentID]
          const model = fragment.mesh.parent
          if (!(model instanceof FragmentsGroup && model.properties)) { continue }
          const properties = model.properties
          OBC.IfcPropertiesUtils.getRelationMap(
            properties,
            WEBIFC.IFCRELDEFINESBYPROPERTIES,
            (setID, relatedIDs) => {
              const set = properties[setID]
              const expressIDs = fragmentIdMap[fragmentID]
              const workingIDs = relatedIDs.filter(id => expressIDs.has(id.toString()))
              const { name: setName } = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
              if (set.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) { return }
              if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
              OBC.IfcPropertiesUtils.getQsetQuantities(
                properties,
                setID,
                (qtoID) => {
                  const { name: qtoName } = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                  if (!qtoName) { return }
                  if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
                }
              )
            }
          )
        }
        console.log(this._qtoResult)
      }
    
      
    get(): QtoResult {
      return this._qtoResult
    }
    

}