import { Card, CardContent } from "@/components/ui/card";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ryan Hoffman",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec",
  },
  {
    name: "Austin Distel",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1554774853-b415df9eeb92",
  },
  {
    name: "Sarah Parker",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1554774853-6a56f62c6451",
  },
];

export default function TeamSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name}>
            <CardContent className="p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
