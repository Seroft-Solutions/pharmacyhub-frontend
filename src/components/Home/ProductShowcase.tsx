import Image from "next/image";

export default function ProductShowcase() {
  return (
      <div className="bg-teal-900 text-white py-16 px-8 flex flex-col md:flex-row items-center gap-8">
        {/* Left Section: Text Content */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-bold">See Our Products</h2>
          <p className="text-xl text-blue-300 font-semibold">
            We have several product candidates in development that we believe
            have been significantly de-risked.
          </p>
          <p className="text-base text-gray-300">
            At vero eos et accusam justo duo dolores et ea rebum clita kasd gubergren nosea takimata sanctus est lorem ipsum dolor consectetur sadipscing et sed diam nonumy eirmod tempor invidunt ut labore magna aliquyam sedam voluptua.
          </p>
          <button className="bg-orange-500 text-white px-6 py-3 font-medium rounded-md hover:bg-orange-600 transition">
            See All Projects
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
              src="/Images/med.jpg" // Replace with your image path
              alt="Pills"
              width={400}
              height={400}
              className="rounded-lg"
          />
        </div>
      </div>
  );
}
