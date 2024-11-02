import { Link } from "@/routing";

export function SospesoList({
  sospesoList,
}: {
  sospesoList: {
    id: string;
    from: string;
    to: string;
  }[];
}) {
  return (
    <ul>
      {sospesoList.map((sospeso) => (
        <li key={sospeso.id}>
          <Link routeKey="소스페소-상세" params={{ sospesoId: sospeso.id }}>
            From. {sospeso.from} To. {sospeso.to}
          </Link>
        </li>
      ))}
    </ul>
  );
}
