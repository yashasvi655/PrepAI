import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/attempts/leaderboard");
        setLeaders(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading leaderboard...
      </div>
    );
  }


  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >

      <div className="max-w-5xl mx-auto">


        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          🏆 Leaderboard
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-8 right-8 text-sm px-3 py-1.5 rounded-md border hover:bg-gray-100 transition"
          style={{ color: "var(--accent)" }}
        >
          ← Back
        </button>

        <p
          className="mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Top performers based on highest quiz scores
        </p>


        {/* Top 3 Cards */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          {leaders.slice(0, 3).map((user, index) => (

            <div
              key={index}
              className="card p-6 text-center shadow-md"
            >

              <div className="text-4xl mb-3">
                {
                  index === 0 ? "🥇" :
                    index === 1 ? "🥈" :
                      "🥉"
                }
              </div>


              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-xl font-bold mb-3"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "white"
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>


              <h2 className="font-semibold text-lg">
                {user.name}
              </h2>

              <p className="text-sm opacity-70">
                {user.topic}
              </p>

              <div className="mt-3 font-bold text-xl">
                {user.score} pts
              </div>

            </div>

          ))}

        </div>



        {/* Full Ranking Table */}

        <div className="card p-6 shadow-md">


          <h2 className="text-xl font-semibold mb-5">
            Complete Rankings
          </h2>


          {
            leaders.length === 0 ? (

              <p>
                No attempts available yet.
              </p>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">


                  <thead>
                    <tr className="text-left border-b">

                      <th className="p-3">
                        Rank
                      </th>

                      <th className="p-3">
                        User
                      </th>

                      <th className="p-3">
                        Topic
                      </th>

                      <th className="p-3">
                        Score
                      </th>

                      <th className="p-3">
                        Date
                      </th>

                    </tr>
                  </thead>



                  <tbody>


                    {
                      leaders.map((user, index) => (

                        <tr
                          key={index}
                          className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
                        >

                          <td className="p-3 font-bold">
                            #{index + 1}
                          </td>


                          <td className="p-3 flex items-center gap-3">


                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: "var(--accent)",
                                color: "white"
                              }}
                            >
                              {user.name?.charAt(0).toUpperCase()}
                            </div>


                            <div>
                              <p className="font-medium">
                                {user.name}
                              </p>

                              <p className="text-xs opacity-60">
                                {user.email}
                              </p>
                            </div>


                          </td>


                          <td className="p-3">
                            {user.topic}
                          </td>


                          <td className="p-3">

                            <span
                              className="px-3 py-1 rounded-full font-semibold"
                              style={{
                                backgroundColor: "var(--accent)",
                                color: "white"
                              }}
                            >
                              {user.score}
                            </span>

                          </td>


                          <td className="p-3">
                            {new Date(user.createdAt)
                              .toLocaleDateString()}
                          </td>


                        </tr>


                      ))
                    }


                  </tbody>


                </table>

              </div>

            )
          }


        </div>


      </div>

    </div>
  );
}

export default Leaderboard;