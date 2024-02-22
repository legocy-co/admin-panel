import * as Switch from '@radix-ui/react-switch';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Toggle = ({ checked, onChange }: Props) => {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      className="w-12 h-7 bg-white rounded-full data-[state=checked]:bg-primary-default outline-none cursor-pointer p-1 transition-all flex-shrink-0"
    >
      <Switch.Thumb className="block w-5 h-5 bg-black rounded-full transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5" />
    </Switch.Root>
  );
};
