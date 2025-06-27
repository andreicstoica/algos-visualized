export class Stack<T> {
  private items: T[];
  // Private array to store stack elements

  constructor() {
    this.items = [];
    // Initialize the array as empty
    //when a new stack is created
  }

  // Method to push an
  // element onto the stack
  push(element: T): void {
    this.items.push(element);
  }

  // Method to pop an
  // element from the stack
  pop(): T | undefined {
    return this.items.pop();
  }

  // Method to peek the top element
  // of the stack without removing it
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Method to peek 2nd to the top element
  // of the stack without removing it
  peek2(): T | undefined {
    return this.items[this.items.length - 2];
  }

  // Method to check
  // if the stack is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Method to get
  // the size of the stack
  size(): number {
    return this.items.length;
  }

  // Method to
  // clear the stack
  clear(): void {
    this.items = [];
  }

  // Method to print
  // the elements of the stack
  print(): void {
    console.log(this.items);
  }

  toArray(): T[] {
    return this.items.slice();
  }

  slice(start: number, end?: number): T[] {
    return this.items.slice(start, end);
  }
}

// Example usage
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
stack.print();

// Output: [1, 2, 3]
console.log("Top element:", stack.peek());

// Output: 3
console.log("Stack size:", stack.size());

// Output: 3
console.log("Is stack empty?", stack.isEmpty());

// Output: false
console.log("Popped element:", stack.pop());

// Output: 3
stack.print();

// Output: [1, 2]
console.log("Is stack empty?", stack.isEmpty());

// Output: False
// Clearing the stack
// using stack.clear
stack.clear();
console.log("Is stack empty?", stack.isEmpty());
// Output: true
