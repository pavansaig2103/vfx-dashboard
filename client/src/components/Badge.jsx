import { slug } from '../utils/shotUi';

export default function Badge({ type, value }) {
  return <span className={`badge ${type}-${slug(value)}`}>{value}</span>;
}
