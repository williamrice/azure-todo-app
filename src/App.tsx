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
import { Input } from "./components/ui/input";

interface Todo {
  id: string;
  text: string;
  complete: boolean;
}

const formSchema = z.object({
  text: z.string().min(2).max(50),
});

function App() {
  const [todos, setTodos] = useState<Todo[] | []>([]);

  const addTodo = (text: string) => {
    const todo = {
      id: crypto.randomUUID() as string,
      text,
      complete: false,
    };

    setTodos([...todos, todo]);
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
    async function list() {
      console.log("starting query");
      const query = `
      {
        todo {
          items {
            id
            text
            completed
          }
        }
      }`;

      const endpoint = "/data-api/graphql";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query }),
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      console.table(result.data.todo.items);
    }

    list();
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
            {todos.map((todo) => (
              <div key={todo.id}>
                <span>
                  {todo.id} : {todo.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
