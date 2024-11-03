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
    <ul className="flex flex-col items-center">
      {sospesoList.map((sospeso) => (
        <li key={sospeso.id}>
          <Link
            className="link link-primary"
            routeKey="소스페소-상세"
            params={{ sospesoId: sospeso.id }}
          >
            From. {sospeso.from} To. {sospeso.to}
          </Link>
        </li>
      ))}
    </ul>
  );
}
