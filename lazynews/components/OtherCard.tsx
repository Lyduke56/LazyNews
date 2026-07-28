import React from 'react';

interface OtherCardProps {
  title?: string;
  summary?: string;
  imageUrl?: string;
}

export function OtherCardImage({ imageUrl = 'https://placehold.co/400x300' }: { imageUrl?: string }) {
  return (
    <div className="other-card-image">
      <img src={imageUrl} alt="Other card thumbnail" className="w-full h-auto object-cover" />
    </div>
  );
}

export function OtherCardTitle({ title = 'Default Other Card Title' }: { title?: string }) {
  return (
    <div className="other-card-title">
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
  );
}

export function OtherCardArticleSummary({ summary = 'Default summary text for other card.' }: { summary?: string }) {
  return (
    <div className="other-card-article-summary">
      <p>{summary}</p>
    </div>
  );
}

export default function OtherCard(props: OtherCardProps) {
  return (
    <div className="relative other-card border p-4 shadow-sm rounded-xl overflow-hidden">
      {/* Background Image layer at 50% opacity */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: 'url(/card-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-2 w-full h-full">
        <OtherCardImage imageUrl={props.imageUrl} />
        <OtherCardTitle title={props.title} />
        <OtherCardArticleSummary summary={props.summary} />
      </div>
    </div>
  );
}
