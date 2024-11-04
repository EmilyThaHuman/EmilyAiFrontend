'use client';

import { SettingsIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { toast } from '@/services';
import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { getSettings, settingsSchema, updateSettings } from 'lib/userSettings';

export const UserSettings = ({ showLabel = false }) => {
  const form = useForm({
    resolver: { settingsSchema },
    defaultValues: getSettings(),
  });

  function onSubmit(values) {
    updateSettings({
      ...getSettings(),
      ...values,
    });
    toast.success('Saved settings!', {
      position: 'bottom-center',
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full flex items-center justify-start gap-4 px-1">
        <SettingsIcon className="w-6 h-6" />

        {showLabel && <span className="font-medium text-sm">Settings</span>}
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="anthropicApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anthropic API Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openaiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
