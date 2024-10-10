import {useEffect, useState} from "react";
import type {Schema} from "../amplify/data/resource";
import {generateClient} from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
    const {signOut}= useAuthenticator();
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        client.models.Todo.create({content: window.prompt("Todo contenu")});
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({id});
    }

    return (
        <main>
            <h1>Mes todos</h1>
            <button onClick={createTodo}>+ nouveau</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>{todo.content}
                        <button onClick={() => deleteTodo(todo.id)}>Effacer</button>
                    </li>
                ))}
            </ul>
            <div>
                🥳 App déployée avec succès. Essaie de créer une nouvelle todo.
                <br/>
                <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                    Lien du tuto.
                </a>
            </div>
            <button onClick={signOut}>Déconnexion</button>
        </main>
    );
}

export default App;
