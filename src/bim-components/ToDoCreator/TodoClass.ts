import * as OBC from "openbim-components"
import { TodoCreator } from ".";

export class ToDo extends OBC.Component<{todos: string[]}> implements OBC.UI, OBC.Disposable {
    enabled: boolean =  true
    private _components: OBC.Components
    private _todos: string[] = []
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        todoList: OBC.FloatingWindow

    }>();

    async setup() {
      const todoCreator = await this._components.tools.get(TodoCreator)
      todoCreator.uuid.addTodo.onAddTodo.add((todo) => {
        this.addTodoToList(todo)
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
    
        const todoList = new OBC.FloatingWindow(this._components)
        todoList.title = "To Do List"
        this._components.ui.add(todoList) 
        todoList.visible = false // hidden by default 
    
        activationBtn.onClick.add(() => {
          activationBtn.active = !activationBtn.active
          todoList.visible = activationBtn.active
        })
    
        this.uiElement.set({activationBtn, todoList})
      }
    
      async dispose() {
        this.uiElement.dispose()
      }

      async addTodoToList(todo: string) {
        this._todos.push(todo)
        this.uiElement.get(this._todos).todoList.content = this._todos.join("\n")
      }
}