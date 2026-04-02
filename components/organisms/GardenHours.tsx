export default function GardenHours() {
  return (
    <section className="w-full px-4 md:px-10 lg:px-0 py-8 md:hidden">
      <div className="mx-auto max-w-[327px]">
        <div className="bg-[var(--green-primary)] rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Garden Hours</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <span className="text-base">Mon - Fri</span>
              <span className="text-base">09:00 - 18:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base">Sat - Sun</span>
              <span className="text-base">10:00 - 20:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
