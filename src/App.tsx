import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "./components/ui/input";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "./lib/graphql";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const formSchema = z.object({
  text: z.string().min(2).max(50),
});

function App() {
  const [todos, setTodos] = useState<Todo[] | []>([]);

  const addTodo = async (text: string) => {
    const todo = {
      id: crypto.randomUUID() as string,
      text,
      completed: false,
    };
    createTodo(todo).then((data) => {
      setTodos([...todos, data]);
    });
  };

  const deleteTodoOnClick = (id: string) => {
    deleteTodo(id).then((data) => {
      console.log("data in onclick --- ", data as string);
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  const completeTodoOnClick = (data: Todo) => {
    updateTodo(data.id, { ...data, completed: true });
    setTodos(
      todos.map((todo) =>
        todo.id === data.id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    addTodo(values?.text);

    form.reset();
  }

  useEffect(() => {
    getAllTodos().then((data) => {
      console.log(data);
      setTodos(data);
    });
  }, []);

  return (
    <>
      <div className="layout flex-col items-center mt-6 ">
        <div className="container  max-w-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex gap-1"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Todo Text</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <div>
            {/* //sort by completed */}

            <Table>
              <TableCaption>A list of your recent todos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Todo</TableHead>
                  <TableHead>Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todos
                  .sort((a, b) => (a.completed > b.completed ? 1 : -1))
                  .map((todo) => (
                    <TableRow key={todo.id}>
                      <TableCell>
                        <span
                          className={`${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.text}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={todo.completed}
                          onClick={() => completeTodoOnClick(todo)}
                        >
                          {todo.completed ? "Task Completed!" : "Complete"}
                        </Button>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteTodoOnClick(todo.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
