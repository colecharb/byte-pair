function Token({ token }: { token: string }) {
  return (
    <div className='text-xs bg-muted rounded-md px-2 py-1'>
      <pre>{token}</pre>
    </div>
  );
}

export { Token };
