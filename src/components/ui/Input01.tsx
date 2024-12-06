import { Label } from "@radix-ui/react-label";
import { Input } from "./input";

export default function Input01() {
    return (
      <div className="space-y-2">
        <Input id="input-01" placeholder="Email" type="email" />
      </div>
    );
  }


  
export  function InputDemo() {
    return (
      <div className="space-y-2">
        <Label htmlFor="input-01">Simple input</Label>
        <Input id="input-01" placeholder="Email" type="email" />
      </div>
    );
  }
  