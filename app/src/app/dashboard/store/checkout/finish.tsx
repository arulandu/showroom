import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleChange } from "@/lib/handleChange";
import { atom, useAtom } from "jotai";

export const notesAtom = atom("")
export const Finish = ({ onComplete }: { onComplete: () => {} }) => {
  const [notes, setNotes] = useAtom(notesAtom)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conclusion</CardTitle>
        <CardDescription>Finishing remarks to complete the order.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Anything you want to say about the order..." className="" value={notes} onChange={handleChange(setNotes)} />
        </div>
        <Button className="mt-4 w-full" onClick={onComplete}>Complete Order</Button>
      </CardContent>
    </Card>
  );

}