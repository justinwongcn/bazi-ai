import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BaziCalculator } from './utils/baziCalculator';
import { SolarTime, LunarHour } from 'tyme4ts';
import Sidebar from './components/Sidebar';

const getElementColor = (char: string) => {
  const colors: Record<string, string> = {
    '甲': 'text-[rgb(7,233,48)]', '乙': 'text-[rgb(7,233,48)]',
    '寅': 'text-[rgb(7,233,48)]', '卯': 'text-[rgb(7,233,48)]',
    '丙': 'text-[rgb(211,5,5)]', '丁': 'text-[rgb(211,5,5)]',
    '巳': 'text-[rgb(211,5,5)]', '午': 'text-[rgb(211,5,5)]',
    '戊': 'text-[rgb(139,109,3)]', '己': 'text-[rgb(139,109,3)]',
    '辰': 'text-[rgb(139,109,3)]', '戌': 'text-[rgb(139,109,3)]', '丑': 'text-[rgb(139,109,3)]', '未': 'text-[rgb(139,109,3)]',
    '庚': 'text-[rgb(239,145,4)]', '辛': 'text-[rgb(239,145,4)]',
    '申': 'text-[rgb(239,145,4)]', '酉': 'text-[rgb(239,145,4)]',
    '壬': 'text-[rgb(46,131,246)]', '癸': 'text-[rgb(46,131,246)]',
    '亥': 'text-[rgb(46,131,246)]', '子': 'text-[rgb(46,131,246)]',
  };
  return colors[char] || 'text-gray-800';
};

const getHiddenStems = (dz: string): string[] => {
  const hiddenStemsMap: Record<string, string[]> = {
    '子': ['癸水'],
    '丑': ['己土', '癸水', '辛金'],
    '寅': ['甲木', '丙火', '戊土'],
    '卯': ['乙木'],
    '辰': ['戊土', '乙木', '癸水'],
    '巳': ['丙火', '庚金', '戊土'],
    '午': ['丁火', '己土'],
    '未': ['己土', '丁火', '乙木'],
    '申': ['庚金', '壬水', '戊土'],
    '酉': ['辛金'],
    '戌': ['戊土', '辛金', '丁火'],
    '亥': ['壬水', '甲木'],
  };
  return hiddenStemsMap[dz] || [];
};

const getElementMeta = (char: string) => {
  const metaMap: Record<string, { label: string; color: string }> = {
    '甲': { label: '木', color: '#07e930' }, '乙': { label: '木', color: '#07e930' },
    '寅': { label: '木', color: '#07e930' }, '卯': { label: '木', color: '#07e930' },
    '丙': { label: '火', color: '#d30505' }, '丁': { label: '火', color: '#d30505' },
    '巳': { label: '火', color: '#d30505' }, '午': { label: '火', color: '#d30505' },
    '戊': { label: '土', color: '#8b6d03' }, '己': { label: '土', color: '#8b6d03' },
    '辰': { label: '土', color: '#8b6d03' }, '戌': { label: '土', color: '#8b6d03' }, '丑': { label: '土', color: '#8b6d03' }, '未': { label: '土', color: '#8b6d03' },
    '庚': { label: '金', color: '#ef9104' }, '辛': { label: '金', color: '#ef9104' },
    '申': { label: '金', color: '#ef9104' }, '酉': { label: '金', color: '#ef9104' },
    '壬': { label: '水', color: '#2e83f6' }, '癸': { label: '水', color: '#2e83f6' },
    '亥': { label: '水', color: '#2e83f6' }, '子': { label: '水', color: '#2e83f6' },
  };
  return metaMap[char] || { label: '', color: '#9ca3af' };
};

const getElementIconDataUri = (char: string) => {
  const meta = getElementMeta(char);
  const iconMap: Record<string, string> = {
    '木': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAACIlBMVEUAAAC4pZTu4tC4l3PxzZfGs5/ZzL3w3sWKVB3qr1b3v2f3wGufhm72xnvxxYHxzJTIsZjOvqzVxbPLv7Tj18nu4M1nMwFpOg2GSw2YYil/WjidbjuEY0SsgVGvhFbwtmDwuGObgGazjmeqi2rqt2ymj3m+oYLCpojyyo7Fq5Dw06b13752OwFjNAh4RBF4Rhd4TieLXS97VzWAXTuOaESneEaqfEuQbU3NmFOOb1OWemCzjGK5k22ki3TftHa/n32umofyx4a2oY3Rvaf13LbWzcbYlzvhokjPjC9oNAFmMgFfLwCERAF7PwFjMQHprVSHRgGBQgF0OwFhMAB+QAFwOAHHgSOGRQGCQwHwtl9xOQFlMgF/QQF6PgF4PQFzOgFqNQFeLgDmqVDdnUJ3PAHTkTTKhSfBehpcLQD2vWfvtFx2PAHAeBhtNgHdoEpuNwGtejubZy3EfiKSVhKKSQRrNQH2xHbwvG3vuWfnrVjjp1DRjjLHgyiUWxyOUBDvvnLlsmftt2TstGDaqGDXo1jgo0zWmUPam0Gsdza5fjWtdC7LhytrQxx6Rg9jOA9oOg6MTgttOALz0Z3YuY3fuIHtu3Lyv3H2wXDhs2/quW7Oo2firmHssFm6jVjiqVfHl1XQnFTWnlDLlk7Wmke+ikezgkPPkkHSkDXHiTWfazV0TirCgCmrbiazdCW6diCPWh/Cex2qaRuGUhpxQA10QAxwPgq/SdA8AAAARnRSTlMAPwJfPDMVD7Z9cGxkW1JAOicgHgoH0cbFqZuXjoJ9cnBsa2hmWVFLRkMsF9HLwburo52Xj42HhYGBcnBmXlxWTExGLCAM6Bt+bQAAAoFJREFUSMftlEd7ElEUhieECIEAgpBqjCmaZu+9i4EBHFoglEA0BqIEadJDejcmsffee/1/3svMMLjwAs/jwgXvalh8977fnDNgRYr8R5Ts2rple6m04Ni2SsWQUdfLbS8sd3iz3qoYsujsBm5rIbk1O3GN0nnZccluMNeUFSK6hGvSpmqb2VRfQLCijzTtNWhVxLq8Y6tO1GZMtabl0vxSkr1VlUocBK8YHf3QNFXXvDp3jNVYBe6y0qZqYGrWWTZxN+YKNrpxq0Kh6dMDUwswBUEbvLm6KccYasFdTkW2KaFOv9xqdNOSa3jG1EiaqvrJl1uDLFrhBvNz/mGq1aUfTKmjqDmsdetBRX22qY168KMWqOwqvEuZZUpXVBG7OYjgBmCqzDZlKhIHETnpfhDMMjUAU60DnAAegqhJit9DSbA2lKkNmBroiicRwWM4lLTqF32T90ZGn84vqwjCTk1ljwwRPAArKn74RiLeha+eQOL1xxCsCLuGmlBrswMO4+er296AiyTwzUxVHG5Frg009Y/GFwZoPqeoiu/EOdZGueIbk1/IkAxSFetZqLWBw1iZHT/P8DZIVTyEXBu35tf3L7OT5xjmFh1kxXbU2iz5J8Lh6Fi05yLN4+cvfcNaULFO8vfc6eYn4ViXy+NxJR4OUox75dPeZ/Mh5P+V+H5kpptk4M30xN0Hd+JJD8SV/BQsRX1St6a6Mnx4dCPi7aYJzKE+4s7ojDzDi5vXYwnmnH0SRJDTcoahpYMdlzMcwVCwy8/SlIuwjhhzzBQbQ9LW0EOyXoRhLCFzjJCFoTkl4PEGeXxhJ/whO95AHdOG5YGMw2JaiwR8voAtxYoU+Vf8BupYG2jYx+awAAAAAElFTkSuQmCC',
    '火': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAC+lBMVEUAAAD14tL13NX0yML10cf12M/35c76vpr1uKLura340rnwu7332svqh433yLL468T318b59sr7sIf6uY35wJL4v6Ptnp/34LPvs7X30L322c70m4Tzoovrj4z6r5b1o5X43Jv50ZztmZf54rH76MP52MH0snj734LumXn5uYHofHz6147655jslZX2vqn2vaj23qr13Knuqar//////tX/+8D/4U3//uz/8Hr/3Ub/2kP/0Dv+wTr9vTb/yS39nCz/9Zv2qo7/84r/6mL7jSX/+Kz5uY73o3/8rHr/5mf2h2L/5Vb+y0D8lR733czwran/8pT/7ID/7W34sm3/4FT/2kf/1T7/yDz6iDn+rS/+qxj8mBj1spv5u4j1onj/6W3/4Vv4l1b3g1P+1Ub7kzv+zzb/xjb9tjX4li39nxX8pA/1rAP6uwL//cjxvb/51bv5waLxopv5vpfxjnr/6nf2gmz3tmD/5lvlUVjtbFb6h0j1j0X/2ED3kjT8qTP+sTH/wzD7kjD9pSz+vSf6kib/wiP+uB7+hBH/7A/dEg3+2gbbAwL///b//er//97259j4+NX41cX36MT0ysHywb3/+Lz3zbr5ya31taX/9aT3ypzumZnsj5X6y474rIf0lYfviIDpdXr7pXf82G/0nW75oGP4l2H6pln2jVT2rVL6wFH6okr4lUn8xkf8v0f8oDbiMDX+tyX9nSL7jh/fIR/8cBv8sgvrYQP07Onxurb1xrX427P/+rH6zbD//6rvpqT60p3woIj7sILrfoD2u33yqn30lHX+6nP7yHH5vnH1iXDoanDsfm/yqWf7z2b+4mTmYWT9xVv+z0njQEHnSjH4ji/8tirkOyD9tRj8vBT+TBP+0xL2gBL5lw7+kwv8wwXlRQH5ywDscAD49c3zu6z//57//4r+8In+3YT723n/+G7nZ2n//2j5tFnoWU75r0H/7T7+3jzveDn//zb4ZjX5dDHugynznif6WyfrYSX90STviQDiKgDgIQBfm0P8AAAAM3RSTlMACgU1JxAXp4ZlUkMfxWAyLyfdyLqLiV9RRRXWwbmvrKGfnGhBPu/q6uXgxqyheHhycm2iTzfpAAAD9klEQVRIx+3VVVAbQRjA8Q0kxUrd3d0lhWgDNNZAoCEhAgmxEoMixaW41lvc3d3q7u7u7u4y0zvazvQl9thOfw93T//Z229n9sB//zwTo4tuKPjZv7+psaHlYLg29+1r1t2oDmneAw63OGVS+xiz6BBz9xnQ9lAZTk6+JWZGhDNJJHcoRGxYtyajoI/hH9trGIlCQUIz3bDOaRl5z2CDwx6kAgqlBxxmQCHV0tCjMelfQCFlWSKA1eYty7bvoZqhuqOgeY001TsafyEla2Pm6L7mG+/5k6lU8vbxADJ0hL4d9vQvI/n4+J5ocPdxryinsg7t6gUg/fogETrXG+FLFrr7MEmnpUGFB8LCKk+XLkNajgeoflTSIF37HFxC9hAyN/sdqXWrL6eHcXlu+esyc8YB0LeugmmlIzQTe3hQmMxCuuxC/XMxVxbnVZLlvwsJEKyY2v0WSO3h5Mp8D+FOvwC6bAWuoZHbGB0lCaxgmZma10a9ZPlpnyzi8OGtHmW5hYF0GS86mhcThW8MC6wKrzuwuxqPC9J+JAhwqGZ9jjigKFASw1u6dAVxBZ7IldDFdZIjQXLG8QHaut6ITeTq9Vsrw+kSrsILDr3wRIfzVWLup9Dd+4XDtQ6n59pNzL0b1+xzgMTi3JbyukKHGNn7K+8C8vIsgPZwzc7iXKd8RWsrEcdww8UScTiiQ3x8ZPuV9qqiXJTWsPfa9X7Fe4vKFY6xUMfAt7TgGLGtjo7x19qTIul5CO1ht7s5AcXHwqPwDCwEr+S7MXiOkKSkpPjwY4OAVohulvvKjtec',
    '土': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAA4VBMVEUAAADPo13TrXHezreylnnZzb6VcEmukXLg1MWkg2DQqGm8pYzBrZjRwbDe0Lvh18yUbEG6oYPavI2/qZLavpTOu6XgyqfQwKy8k1nJoWKnh2WoimrFom7UsXnizq6cdk6beFO5j1efflutjmitjmrXtX/BrJXUu5nexJzPo12WbULKnlrOolzMoFuxh0+uhE2Yb0O7kFOheEfHnFnBllaacUS0iVCke0mQaT/FmVi+k1WsgkyedUa4jVGof0qYcUegdka+lFW9kVSbdU6Ub0bWtHzSrnjUrXC/mF+jgFyxiVe0AUTTAAAAKXRSTlMAdmIcWRSJYQ1yaUY6IhcGkU9FQD4uLCZ5cG1oZFolhYF8eGpoVD46Nuq7/80AAAF8SURBVEjH7ZPXWsJAEEYjBEIxFKWJgL3spveELmB9/wfSKGQC7G7k0s+cu704O//M7nApKf+e8mVeqByu5Yo13/fz5YO9GzWwDPO3ZqUu8G0upG6jLyQV54+TtSpfwxjXiiLHNTvoG0XF12Jiui7+4eJe7KE1kubzCV5B8BaKbLljjJcfEtoQeElhy66CQqyRjh1XjkzDOS+wvOaVvEmn6nhuIAi7OmU12As9MKdBdHwas0o+QFdhWqyr0UWKuqJ3mT1DcWwPm4tYSaFKExvylihPHKwpUUlt2UwqCBOJz8dw6rSCaJehiUdS1PO0myMXLCEg+mtjKDmZkcfTktEedlgSDjzxs/XRPoqrm0MYTzFLEAeIhO3F3vLttk0QT7YN6NKzN4fnAml7S4jIcO50Mmv6pKStXQPekjASVlJ4dxgJOSmFYDqDhUpOCsiuLhyWFP7du0jf4AxdtDRG1gFiMNHpc22wxJc2dYOrdyzxlf4c2dIRi0cuJeXv8glG/oWZ7yFlmwAAAABJRU5ErkJggg==',
    '金': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAABjFBMVEUAAADVvW/LrUnq4Lzs5tG8kwnMsE/r37Tq37jy6Mft5s69kwu/mRjAmhr30Erw01jw3I/t3Zzs3rDp3rrpwhLGpDPz1mnz2nvYxIDn16Lr4sG7kQW/lhHCniPpxyrwyzPwyzn2zkLx0E/z0lXPs1fQt1/SuWf42nbVvnP03Yf335DayIvcy5Py5Krv58u6jwC8kgbowAzqwxrBmx3sxSDvzD3Wtj3IqUDrzELUtUzryVj41mX11mX12G/y2HHs2X724Zj14pzo37+6jwDswhXvxBvqwQ+8kgXwxB3zxiPuwxntwxfyxSHxxR/rwhLVsS7JpCTXsS7LpCO8kQPlxUbtzkHUsTH1xyXyzUDnxUbwzj/3yzbzyS7xyS32yCnzxyjuxybtxBrowA32zkP1zkH1yjD1ySzxyCrpwhK+lAjqxUjqxUf4z0XiuBTluxLFmgb50k/qxkrhwkP2yzngvDnYsjXRrTHLpirowiPDnBzWrxrswxfftBXmvRK/lQrSpwnQpgnOowjLoAjKnwfxWM3JAAAAQ3RSTlMAY4kXAsmDHxsNBMe7uIx7RDckGcGgbFlSMRLNwa+pn5qThX98c2xiX05ISEArCdPNx7m1s5WVk5GGenRwZmJUPjoUUvhmZwAAAexJREFUSMft1VdX4kAYxvEA0SBIE3ZdXdfetuj2vmt7wUBAUVFRaYIKYu+9+8UdGJKJISPIjV7wv5xzfpObJ2eYcuWeQ0NVpbn3Wq4kZ/t6aC3F1b2BiT/vHu9qXgBMbJvlsldXhNP9BARXQy0D0pGhQ1PY1WshA1dCSbNNPOvgfxf8pKEdMFwKJlt78JnmNb/fVVMAdgYwXF3yeJIWjkG9MgI/vvXXTjX4csBwFkFP+F89cg2A4FroJXUT+HIRhn2o8P+qD9WQhdFQVy99MA2Qa2w2PILyRfaOIQsXotHdWppDlxMYcWc624QcDAajzW+pgyFwMuVCrWOHYTDWYqUMRg7nBUFYvwURLnpQMfNgvuOwI9Dr3bgBGcSyTmUwCujcuAYJ+hd92WJtyiGwmmoFPL8CqYB/ZgSXsujzxoapCI8uA/egO1dKZQisxiTBnRPsCHTh3JE+A0OnYwdpuA9dUhHVIbDdpo8AkL4AJRTEXE2UIXSbQBnvn4t7peJNVnXJdqbzoeAkxb/b1KVd+ykPep1y2aZn1OO0FQp4Okr69tC/qZdTfnrKOSz2xaKjKkwrK1Sgo5WjEyUl0PGrhykqO6IYLicSCUezrTAh1JiDnxsf+aDoKo0Z2NhftCC0/YellmVKycCUK/fU3QH9UdPcti0RdwAAAABJRU5ErkJggg==',
    '水': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAABklBMVEUAAACayfWv0/SeyfCGv/Wnz/Oq0PO/2fHL4PR/wPuAuvCYyPWfzPamz/W41/PB2vHI3vPQ4vNttPZvsO55u/l4t/KQwfC81/Jbp+5mrvFwufxytvZ3tvGGvO+Px/qMwPGXyvqcyfOrzvC11vTD2/LG3PJJnu1LnutWpe9ervldrPdmsvd2u/uEwvyJxPul0Pex0/Iiieoykeo7luxBmOpqtvyTxvbN4fNfsv9csf9Xrf1ltP5arv202/+t2P+Zz/9Uq/2Vyvs6mvRNo/Pk8v+x2v+l1P+Wzf+Lx/9ntv9is/9gs/+s1v1qtv1PqPtptPlYrPlRqPlxtvdZq/dGofUvj+rq9f/c7v/Y7P+63v+q1v+e0P+Gxf9/wf90vf9uuv9ruP+dzvuNxvtlsvp2uPdUqPYzl/RkrfJdqvEuk/EkjvAhi+0ch+0Whe0Qgesdhunv+P/d7//V6//L5v+Ryv+Cw/94vv9isvyRyPtls/uZy/qBv/p3uvlHo/l/vfhttfhLpPh+vfdgrfRCnvQnj/EMfun2xTbDAAAAOHRSTlMAOyU1TywqFAlbUz01LxsSDANoY19aQhd3bWtjXUxKR0I4KB4QDoqHfXp5cGRXUjIisaGXkXFCBV7n9/8AAAIvSURBVEjH7ZRXV9tAEIUtG1u4dxtwITY1EAjpIxn3XnA3HUJP6Om9l/8d7UqyFUU5OdJbDr5PWs1+O7t3Z1bVV19XWN4xZZzVp7cpAolGxKQooYMG/aACMNQAKCpIOeGjAWBOfkpNAxgVb8rlbK4EIM09kJvwELCWzPI4uzsBrObtskDtIcWBO1pZ4EAVeM3L4RZmqC44opYBer5AT9f+Od1CcB/jDrrH9epOp/sLaLjH7UqTBoGWuPleh2tCklNfhyBnzUcQysh1S70UknZyEUYW8NLDkW0hOIDDpIMCvU06IUCQ3Wl8/aEAvEGiv6Y6gGSDjtLIe/RaBL5HVzeFh1Tj4qU4o8SWzna996eymbwAfKtFtVRHn5E/S5dgi9M1rlI5j3LLOQG4r2UdQAqKuUE/BfySzh97mbViD6wxWx2b4c5rEYHh5hZgEcx9nu0/f/ayyy36GHPMtVd48Frc2aZPuTJ/aaHT1EYminwtlQCg6kYn2dvAYYoQgcaD7A4OMO5Yp85ba0+jLwrx9UIZEu1RdMQ3sTJObxSD32IFFKDvoxq/ddaqrK6sLD+JQfVo2orK8SC6jUFxRvX0+2w8vkm1NGjkv7xINd9VKrufUyd38B8inYzl81v0rEVsa2Cymdz90Hbb8cthuP3z4vT4+OT8ckrDuu5Mf00ma22PROUMPX40bLDyLeSc7HQ6d4cCJN9qbhT32KWe4HCYFAxJnVn32768WrVN1Vdf/59+Acf2hBrwSM00AAAAAElFTkSuQmCC'
  };
  return iconMap[meta.label] || '';
};

const parseDateTime = (value: string) => {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute };
};

interface BaziColumn {
  title: string;
  tg: string;
  dz: string;
  hiddenStems: string[];
  mainTenStar: string;
  subTenStars: string[];
  starLuck: string;
  selfSeat: string;
  empty: string;
  naYin: string;
}

interface BaziData {
  baseInfo: {
    name: string;
    sex: string;
    solarTime: string;
    lunarTime: string;
    location: string;
  };
  columns: BaziColumn[];
}

function ResultPage() {
  const [searchParams] = useSearchParams();
  const data: BaziData = useMemo(() => {
    const name = searchParams.get('name') || '未知';
    const sex = searchParams.get('sex') === '1' ? '乾造' : '坤造';
    const dateStr = searchParams.get('date') || '1990-01-01T00:00';
    const dateType = searchParams.get('dateType') || '1';
    const lunarMonthParam = parseInt(searchParams.get('lunarMonth') || '', 10);
    const lunarLeap = searchParams.get('lunarLeap') === '1';
    const location = searchParams.get('location') || '未知地';
    const isTrueSolar = searchParams.get('isTrueSolar') === '1';
    const isDst = searchParams.get('isDst') === '1';
    const isEarlyRat = searchParams.get('isEarlyRat') === '1';
    
    const { year, month, day, hour, minute } = parseDateTime(dateStr);
    const lunarMonthValue = Number.isNaN(lunarMonthParam) ? month : lunarMonthParam;
    const monthForCalc = dateType === '0'
      ? (lunarLeap ? -Math.abs(lunarMonthValue) : Math.abs(lunarMonthValue))
      : month;
    
    const longitude = parseFloat(searchParams.get('longitude') || '116.407394');
    const latitude = parseFloat(searchParams.get('latitude') || '39.904211');
    
    const baziResult = BaziCalculator.calculate({
      year, month: monthForCalc, day, hour, minute,
      dateType,
      longitude,
      latitude,
      useTrueSolar: isTrueSolar,
      useDst: isDst,
      useEarlyRat: isEarlyRat
    });
    
    let solarTime: SolarTime;
    let lunarHour: LunarHour;

    if (dateType === '0') {
      lunarHour = LunarHour.fromYmdHms(year, monthForCalc, day, hour, minute, 0);
      solarTime = lunarHour.getSolarTime();
    } else {
      solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, 0);
      lunarHour = solarTime.getLunarHour();
    }

    const solarYear = solarTime.getYear();
    const solarMonth = solarTime.getMonth();
    const solarDay = solarTime.getDay();
    const solarHour = solarTime.getHour();
    const solarMinute = solarTime.getMinute();

    return {
      baseInfo: {
        name,
        sex,
        solarTime: `阳历：${solarYear}年${String(solarMonth).padStart(2, '0')}月${String(solarDay).padStart(2, '0')}日 ${String(solarHour).padStart(2, '0')}:${String(solarMinute).padStart(2, '0')}`,
        lunarTime: lunarHour.toString(),
        location
      },
      columns: [
        {
          title: "年柱",
          tg: baziResult.yearPillar[0],
          dz: baziResult.yearPillar[1],
          hiddenStems: getHiddenStems(baziResult.yearPillar[1]),
          mainTenStar: baziResult.yearTenStar,
          subTenStars: baziResult.yearHiddenTenStars,
          starLuck: baziResult.yearStarLuck,
          selfSeat: baziResult.yearSelfSeat,
          empty: baziResult.yearEmpty,
          naYin: baziResult.yearNaYin
        },
        {
          title: "月柱",
          tg: baziResult.monthPillar[0],
          dz: baziResult.monthPillar[1],
          hiddenStems: getHiddenStems(baziResult.monthPillar[1]),
          mainTenStar: baziResult.monthTenStar,
          subTenStars: baziResult.monthHiddenTenStars,
          starLuck: baziResult.monthStarLuck,
          selfSeat: baziResult.monthSelfSeat,
          empty: baziResult.monthEmpty,
          naYin: baziResult.monthNaYin
        },
        {
          title: "日柱",
          tg: baziResult.dayPillar[0],
          dz: baziResult.dayPillar[1],
          hiddenStems: getHiddenStems(baziResult.dayPillar[1]),
          mainTenStar: baziResult.dayTenStar,
          subTenStars: baziResult.dayHiddenTenStars,
          starLuck: baziResult.dayStarLuck,
          selfSeat: baziResult.daySelfSeat,
          empty: baziResult.dayEmpty,
          naYin: baziResult.dayNaYin
        },
        {
          title: "时柱",
          tg: baziResult.hourPillar[0],
          dz: baziResult.hourPillar[1],
          hiddenStems: getHiddenStems(baziResult.hourPillar[1]),
          mainTenStar: baziResult.hourTenStar,
          subTenStars: baziResult.hourHiddenTenStars,
          starLuck: baziResult.hourStarLuck,
          selfSeat: baziResult.hourSelfSeat,
          empty: baziResult.hourEmpty,
          naYin: baziResult.hourNaYin
        }
      ]
    };
  }, [searchParams]);

  const pillars = data.columns;

  return (
    <div className="flex min-h-screen bg-[rgb(245,245,245)] text-gray-900">
      <Sidebar />
      <div className="flex-1" style={{ padding: '24px 13px 12px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              backgroundImage: 'url(/static/img/paipan_header_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              padding: '20px 24px',
              borderRadius: '15px 15px 0 0',
              minHeight: 105,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}
          >
            {/* 生肖头像 */}
            <img
              src="/static/img/sx_7.png"
              alt="生肖头像"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.6)',
                flexShrink: 0
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.style.cssText = 'width:64px;height:64px;border-radius:50%;border:1px solid rgba(255,255,255,0.6);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:white;flex-shrink:0;';
                  fallback.textContent = data.baseInfo.name?.slice(0, 1) || '命';
                  parent.insertBefore(fallback, target);
                }
              }}
            />
            <div>
              <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
                {data.baseInfo.name}
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                {data.baseInfo.lunarTime} <span style={{ color: 'rgb(178, 149, 93)' }}>（{data.baseInfo.sex}）</span>
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                {data.baseInfo.solarTime}
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden" style={{ borderRadius: '0 0 15px 15px' }}>
          <div className="overflow-x-auto" style={{ padding: 0 }}>
            <table
              className="w-full border-collapse text-center"
              style={{
                minWidth: `${(pillars.length + 1) * 124}px`,
                border: '1px solid rgb(240, 240, 240)',
                borderRadius: 10,
                fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif'
              }}
            >
              <colgroup>
                <col style={{ width: 124, backgroundColor: 'white' }} />
                {pillars.map((_, index) => (
                  <col key={index} style={{ width: 124 }} />
                ))}
              </colgroup>
              <thead>
                <tr style={{ backgroundColor: 'white' }}>
                  <th style={{
                    padding: '13px 0 5px',
                    fontSize: 15,
                    fontWeight: 400,
                    color: 'rgb(158, 158, 158)'
                  }}>四柱</th>
                  {pillars.map((p, i) => (
                    <th key={i} style={{
                      padding: '13px 0 5px',
                      fontSize: 15,
                      fontWeight: 400,
                      color: 'rgb(158, 158, 158)'
                    }}>
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>主星</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 14,
                        lineHeight: '15px',
                        color: 'rgb(161, 161, 161)'
                      }}>{p.mainTenStar}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>天干</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0
                      }}>
                        <span className={`${getElementColor(p.tg)}`} style={{
                          fontSize: 28,
                          lineHeight: '30px',
                          fontWeight: 700
                        }}>{p.tg}</span>
                        <img src={getElementIconDataUri(p.tg)} alt={getElementMeta(p.tg).label} style={{ width: 28, height: 28 }} />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>地支</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0
                      }}>
                        <span className={`${getElementColor(p.dz)}`} style={{
                          fontSize: 28,
                          lineHeight: '30px',
                          fontWeight: 700
                        }}>{p.dz}</span>
                        <img src={getElementIconDataUri(p.dz)} alt={getElementMeta(p.dz).label} style={{ width: 28, height: 28 }} />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
