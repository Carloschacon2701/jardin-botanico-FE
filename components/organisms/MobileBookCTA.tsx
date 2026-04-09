import Button from "@/components/atoms/Button";

export default function MobileBookCTA() {
  return (
    <div className="md:hidden px-8 pb-8">
      <Button href="/booking" size="lg" fullWidth>
        Reserva tu visita
      </Button>
    </div>
  );
}
