
import * as OBC from "openbim-components"
import { TodoCard } from "../src/TodoCard"
import * as THREE from "three"
import { v4 as uuidv4 } from 'uuid';

type ToDoPriority = "Low" | "Medium" | "High"

interface ToDo {
  id: string 
  description: string
  date: Date
  fragmentMap: OBC.FragmentIdMap
  camera: {position: THREE.Vector3, target: THREE.Vector3}
  priority: ToDoPriority
  
}




export class TodoCreator extends OBC.Component<ToDo[]> implements OBC.UI, OBC.Disposable {
  uuid = uuidv4()
  
  onProjectCreated = new OBC.Event<ToDo> ()
  enabled = true
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button
    todoList: OBC.FloatingWindow
  
  }>()
  private _components: OBC.Components
  private _list: ToDo[] = []
  
  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.tools.add(this.uuid, this)
    this.setUI()

  }

  async dispose() {
    this.uiElement.dispose()
    this._list = []
    this.enabled = false
  }
  
async setup() {
  const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
  highlighter.add(`${this.uuid}-priority-Low`, [new THREE.MeshStandardMaterial ({color:0x59bcff})])
  highlighter.add(`${this.uuid}-priority-Medium`, [new THREE.MeshStandardMaterial ({color: 0xFFBC59})])
  highlighter.add(`${this.uuid}-priority-High`, [new THREE.MeshStandardMaterial ({color:0xFF0000})])
}

//Assigment M3-C4-L8
deleteToDo(todo: ToDo, todoCard: TodoCard) {
  const todoListUpdate = this._list.filter((todo) => {
    return(todo.description! === todo.description)
  })
  this._list = todoListUpdate
  todoCard.dispose()
}


getTodoID(id:string) {
  this.uuid = id
  console.log (`searching for project with id: ${this.uuid}`);
  const todoID = this._list.find((todo) =>{
    console.log(`checking project with id: ${id}`);
    return todo.id === id; 
  })
  if(todoID) {
    console.log(`Found project with id: ${id}`)
  } else {
    console.log(`No Prouject found with id: ${id}`)
  }
  return todoID;
} 

  async addTodo(description: string, priority: ToDoPriority) {
    if(!this.enabled) {return}
    const camera = this._components.camera
    if(!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error ("todoCreator need to the orotoprospective camerea in order to work")
    }
    
    const position = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)
    const todoCamera = {position, target}


    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)

    // Todo Objekt
    const id = uuidv4()
    const todo: ToDo = {
      id,
      description,
      camera: todoCamera,
      date: new Date(),
      fragmentMap: highlighter.selection.select,
      priority,
      
    } 
    this._list.push(todo)

    

    const todoCard = new TodoCard(this._components)
    todoCard.description = todo.description
    todoCard.date = todo.date
    todoCard.onCardclick.add(() => {
      camera.controls.setLookAt(
        todo.camera.position.x,
        todo.camera.position.y,
        todo.camera.position.z,
        todo.camera.target.x,
        todo.camera.target.y,
        todo.camera.target.z,
      )
      const fragmentMapLenght = Object.keys(todo.fragmentMap).length
      if(fragmentMapLenght ===0) {return}
      highlighter.highlightByID("select", todo.fragmentMap)
    })
    const todoList = this.uiElement.get("todoList")
    todoList.addChild(todoCard)
    this.onProjectCreated.trigger(todo)

    //skapar ett event för när knappen triggar metoden "Deletetodo". Eventetet styrs av klassen TODOCARD
    todoCard.onCardDeleteClick.add(()=>{
          this.deleteToDo(todo, todoCard)
          console.warn("Todo Deleted")
    })
  }

  private async setUI() {
    const activationButton = new OBC.Button(this._components)
    activationButton.materialIcon = "check"

    const newTodoBtn = new OBC.Button(this._components, { name: "Skapa" })
    activationButton.addChild(newTodoBtn)

    const form = new OBC.Modal(this._components)
    this._components.ui.add(form)
    form.title = "Skapa ny TODO"

  

    

    const descriptionInput = new OBC.TextArea(this._components)
    descriptionInput.label = "Description"
    form.slots.content.addChild(descriptionInput)

    const priorityDopDown = new OBC.Dropdown(this.components)
    priorityDopDown.label = "Priority"
    priorityDopDown.addOption("Low", "Normal", "High")
    priorityDopDown.value ="normal"
    form.slots.content.addChild(priorityDopDown)

    form.slots.content.get().style.padding = "20px"
    form.slots.content.get().style.display = "flex"
    form.slots.content.get().style.flexDirection = "column"
    form.slots.content.get().style.rowGap = "20px"

    form.onAccept.add(() => {
      this.addTodo(descriptionInput.value, priorityDopDown.value as ToDoPriority)
      descriptionInput.value = ""
      form.visible = false
      this.uuid
    })
    
    form.onCancel.add(() => form.visible = false)

    newTodoBtn.onClick.add(() => form.visible = true)
    
    const todoList = new OBC.FloatingWindow(this._components)
    this._components.ui.add(todoList)
    todoList.visible = false
    todoList.title = "Att-göra lista"

    const todoListToolbar = new OBC.SimpleUIComponent(this._components)
    todoList.addChild(todoListToolbar)

    const colorizeBtn = new OBC.Button(this._components)
    colorizeBtn.materialIcon = "format_color_fill"
    todoListToolbar.addChild(colorizeBtn)

    const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
    colorizeBtn.onClick.add(() => {
      colorizeBtn.active = !colorizeBtn.active
      if(colorizeBtn.active) {
        for (const todo of this._list) { const fragmentMapLenght = Object.keys(todo.fragmentMap).length
      if(fragmentMapLenght ===0) {return}
      highlighter.highlightByID(`${this.uuid}-priority-${todo.priority}`, todo.fragmentMap)}
      }
        
      else{
        highlighter.clear(`${this.uuid}-priority-Low`) 
        highlighter.clear(`${this.uuid}-priority-Normal`) 
        highlighter.clear(`${this.uuid}-priority-High`)
      }
    })

    const todoListBtn = new OBC.Button(this._components, { name: "Lista" })
    activationButton.addChild(todoListBtn)
    todoListBtn.onClick.add(() => todoList.visible = !todoList.visible)
    
    this.uiElement.set({activationButton, todoList})
  }

  get(): ToDo[] {
    return this._list
  }

}