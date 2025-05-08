import * as React from 'react';
import { cn } from '../../lib/utils';
import PropTypes from 'prop-types';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-card text-card-foreground rounded-xl border shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

Card.propTypes = {
  className: PropTypes.string,
};

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn('flex flex-row gap-1.5 p-6', className)}
      {...props}
    />
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
};

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'text-2xl leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

CardTitle.propTypes = {
  className: PropTypes.string,
};

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

CardDescription.propTypes = {
  className: PropTypes.string,
};

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  );
}

CardContent.propTypes = {
  className: PropTypes.string,
};

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
}

CardFooter.propTypes = {
  className: PropTypes.string,
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
