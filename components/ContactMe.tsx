import React, { useState } from "react";
import { MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {};

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactMe({}: Props) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setStatus('sending');
    try {
      const response = await fetch('https://formspree.io/f/xwpgrrjy', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen md:h-screen flex relative flex-col text-center md:text-left md:flex-row max-w-7xl px-4 sm:px-6 md:px-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-36 md:top-24 uppercase tracking-[0.25em] md:tracking-[20px] text-gray-500 text-xl md:text-2xl pl-[20px] font-medium md:font-normal">
          Contact
      </h3>
      <div className="flex flex-col space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-6 2xl:space-y-10">
        <h4 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-center">
          Let&apos;s build something amazing together.{" "}
          <span className="decoration-darkGreen/50 underline">Get in touch.</span>
        </h4>

        <div className="space-y-1 md:space-y-3 lg:space-y-3 xl:space-y-3 2xl:space-y-5">
          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-darkGreen h-7 w-7 animate-pulse" />
            <p className="text-lg md:text-2xl lg:text-2xl">
              ismailahouari123@gmail.com
            </p>
          </div>
          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-darkGreen h-7 w-7 animate-pulse" />
            <p className="text-lg md:text-2xl lg:text-2xl">
              Milano, Italy
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 w-full max-w-sm md:w-fit mx-auto"
        >
          <div className="md:flex md:space-x-2 space-y-2 md:space-y-0 ">
            <input
              {...register("name")}
              placeholder="Name"
              className="contactInput w-80 md:w-auto"
              type="text"
            />{" "}
            <input
              {...register("email")}
              placeholder="Email"
              className="contactInput w-80 md:w-auto"
              type="email"
            />
          </div>
          <input
            {...register("subject")}
            placeholder="Subject"
            className="contactInput "
            type="text"
          />
          <textarea
            {...register("message")}
            placeholder="Message"
            className="contactInput"
          />
          <button 
            disabled={status === 'sending'}
            className="bg-lightGreen py-3 md:py-5 px-10 rounded-lg text-white font-bold text-lg hover:bg-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Submit'}
          </button>
          {status === 'success' && (
            <p className="text-green-500 text-center font-medium">
              ✓ Message sent successfully! I&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center font-medium">
              ✗ Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
