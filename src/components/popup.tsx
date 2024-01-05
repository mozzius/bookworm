import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
}

export const Popup = ({ isOpen, onClose, title, children }: Props) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => onClose?.()} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className="fixed inset-0 overflow-y-auto"
            onClick={() => onClose?.()}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="relative mx-auto w-full max-w-xl rounded bg-white p-8">
                <Dialog.Title className="mb-8 text-3xl font-medium">
                  {title}
                </Dialog.Title>
                {!!onClose && (
                  <button
                    onClick={onClose}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-transparent font-[x] text-xl transition-colors hover:border-black"
                  >
                    ×
                  </button>
                )}
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
