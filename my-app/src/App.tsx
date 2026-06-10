import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PinInput } from "./components/base/input/pin-input.tsx";

export default function App() {
  const [value, setValue] = useState("");

  return (
        <PinInput size="xs">
            <PinInput.Group maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                <PinInput.Slot index={0} />
                <PinInput.Slot index={1} />
                <PinInput.Slot index={2} />
                <PinInput.Separator/>
                <PinInput.Slot index={3} />
                <PinInput.Slot index={4} />
                <PinInput.Slot index={5} />
            </PinInput.Group>
        </PinInput>
  );
}
