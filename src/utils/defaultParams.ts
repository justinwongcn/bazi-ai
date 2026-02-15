export const getDefaultParams = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}T${hour}:${minute}`;

  return {
    date: dateStr,
    name: '默认',
    sex: '1', // 乾造
    dateType: '1', // 阳历
    isTrueSolar: '1', // 真太阳时
    location: '北京市 北京市 东城区',
    longitude: '116.41005',
    latitude: '39.93157'
  };
};
