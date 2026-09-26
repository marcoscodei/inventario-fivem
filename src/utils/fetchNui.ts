export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mockReturn?: T
): Promise<T> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const resourceName = (window as unknown as { GetParentResourceName?: () => string }).GetParentResourceName
    ? (window as unknown as { GetParentResourceName: () => string })().GetParentResourceName()
    : 'meu-inventario';

  const isEnvBrowser = !('invokeNative' in window);

  if (isEnvBrowser && mockReturn !== undefined) {
    return mockReturn;
  }

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    const respFormatted = await resp.json();
    return respFormatted;
  } catch (error) {
    return mockReturn as T;
  }
}