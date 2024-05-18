import React from 'react';
import { GrConfigure } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue, Select, SelectTrigger } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { setCurrentModel, setCurrentSystemPrompt, setModelTemperature } from '@/redux/reducers/modelConfigurator.reducer';

function ModelConfiguratorDialog({ setToggleDropDownList }) {
  const { currentModel, availableModels, modelTemperature } = useSelector((state) => state.modelConfigurator);
  const dispatch = useDispatch();
  const maxSliderSteps = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Dialog>
      <DialogTrigger className="w-2/3" asChild>
        <Button className="mt-1 mb-3" asChild>
          <div>
            <GrConfigure className="mr-3" />
            <div>Configure Current Model</div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-2/3">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Configure AI Models</DialogTitle>
        </DialogHeader>
        {/* Select Model */}
        <Select onValueChange={(model) => dispatch(setCurrentModel(model))}>
          <SelectTrigger className=" outline-0 dark:text-white">
            <SelectValue placeholder={currentModel.id || 'Select a AI Model'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>GPT Model</SelectLabel>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model}>
                  {model.id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Config Temperature */}
        <div className="flex flex-row">
          <Label className="mr-5">
            Temperature <Label className="text-xs text-muted-foreground">Creativity</Label>{' '}
          </Label>
          <div className="w-full flex justify-center flex-col">
            <div className="flex justify-between">
              {maxSliderSteps.map((step) => (
                <Label className="mb-1 text-sm" key={step}>
                  {step / 10}
                </Label>
              ))}
            </div>
            <Slider
              className="w-full"
              defaultValue={[modelTemperature]}
              max={1}
              step={0.1}
              onValueChange={(val) => dispatch(setModelTemperature(val[0]))}
            />
          </div>
        </div>
        {/* Edit System Prompt */}
        <div className="grid w-full gap-1.5">
          <Label>System Prompt</Label>
          <Textarea
            placeholder="Try to write something....."
            rows={10}
            onChange={(e) => dispatch(setCurrentSystemPrompt(e.target?.value))}
          />
          <p className="text-xs text-muted-foreground">
            System prompts are used to provide context to the AI model. You can edit the prompt to get different results.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild onClick={() => setToggleDropDownList(false)}>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModelConfiguratorDialog;
