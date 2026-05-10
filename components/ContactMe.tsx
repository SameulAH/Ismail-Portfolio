import React, { useState } from "react";
import { MapPinIcon, EnvelopeIcon, CalendarDaysIcon, ClockIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {};

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactMe({ }: Props) {
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
    <div className="py-10 md:py-16 flex relative flex-col text-center md:text-left max-w-7xl px-4 sm:px-6 md:px-10 mx-auto items-center">
      <h3 className="mb-6 md:mb-8 uppercase tracking-[0.25em] md:tracking-[20px] bg-clip-text text-transparent bg-gradient-to-r from-darkGreen to-lightGreen text-xl md:text-2xl font-bold text-center w-full">
        Contact
      </h3>

      {/* Header text + contact info */}
      <div className="flex flex-col space-y-4 md:space-y-5 mb-8 md:mb-10">
        <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center">
          Let&apos;s build something amazing together.
          <br />
          <span className="decoration-darkGreen/50 underline">Get in touch.</span>
        </h4>

        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-darkGreen h-6 w-6 animate-pulse" />
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              ismailahouari123@gmail.com
            </p>
          </div>
          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-darkGreen h-6 w-6 animate-pulse" />
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Milano, Italy
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* LEFT COLUMN — Contact Form (~65-70%) */}
        <div className="w-full lg:w-[67%]">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/70 shadow-sm p-6 md:p-8 transition-shadow duration-300 hover:shadow-md">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  {...register("name")}
                  placeholder="Name"
                  className="contactInput w-full"
                  type="text"
                />
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="contactInput w-full"
                  type="email"
                />
              </div>
              <input
                {...register("subject")}
                placeholder="Subject"
                className="contactInput w-full"
                type="text"
              />
              <textarea
                {...register("message")}
                placeholder="Message"
                className="contactInput w-full min-h-[140px] resize-none"
              />
              <button
                disabled={status === 'sending'}
                className="bg-darkGreen py-3.5 px-10 rounded-xl text-white font-semibold text-base tracking-wide hover:bg-lightGreen transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
              {status === 'success' && (
                <p className="text-green-600 text-center text-sm font-medium pt-1">
                  ✓ Message sent successfully! I&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-center text-sm font-medium pt-1">
                  ✗ Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN — Calendly Card (~30-35%) */}
        <div className="w-full lg:w-[33%]">
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-sm p-6 md:p-8 transition-shadow duration-300 hover:shadow-md h-full flex flex-col justify-between">
            {/* Card content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-darkGreen/8 flex items-center justify-center">
                <CalendarDaysIcon className="h-5 w-5 text-darkGreen/70" />
              </div>

              {/* Heading */}
              <h5 className="text-lg font-semibold text-gray-800 leading-snug">
                Prefer a direct conversation?
              </h5>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                For collaborations, AI projects,
                <br className="hidden lg:block" />
                {" "}or opportunities.
              </p>

              {/* CTA Button */}
              <a
                href="https://calendly.com/ismailahouari123/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full border border-darkGreen/30 text-darkGreen rounded-xl py-3 px-6 text-sm font-semibold tracking-wide transition-all duration-300 hover:border-darkGreen hover:bg-darkGreen/5 hover:shadow-sm mt-1"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Schedule a Call
              </a>

              {/* Meta info */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  30 min
                </span>
                <span className="flex items-center gap-1">
                  <VideoCameraIcon className="h-3.5 w-3.5" />
                  Google Meet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
