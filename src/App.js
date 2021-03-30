import React from "react";
import axios from "axios";
import styled from "styled-components";
import bclabefyfoto from "./img/bclabefy.gif";

export default class Labefy extends React.Component {
  state = {
    playlists: [],
    tracks: [],
    playlistId: [],
    tracksId: [],
    inputValue: "",
    inputName: "",
    inputArtist: "",
    inputUrl: "",
    screen: "CreatePlaylist"
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };
  handleInputChangeName = (e) => {
    this.setState({ inputName: e.target.value });
  };
  handleInputChangeArtist = (e) => {
    this.setState({ inputArtist: e.target.value });
  };
  handleInputChangeUrl = (e) => {
    this.setState({ inputUrl: e.target.value });
  };

  goToPlaylist = () => {
    this.setState({ screen: "allplaylist" });
  };
  goToAddTracks = () => {
    this.setState({ screen: "addTracks" });
  };
  goToCreatePlaylist = () => {
    this.setState({ screen: "CreatePlaylist" });
  };

  /* Função para criar usuário no banco*/
  createPlaylistUser = () => {
    const body = {
      name: this.state.inputValue
    };
    axios
      .post(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
        body,
        {
          headers: {
            Authorization: "kethreen-lanes-cruz"
          }
        }
      )
      .then((res) => {
        this.setState({ inputValue: "" });
        this.getAllPlaylist();
      })
      .catch((err) => {
        if (
          err.response.data.message ===
          "There already is a playlist with a similiar name."
        ) {
          alert(
            "Já existe uma playlist com esse nome. Porfavor Entre com um nome diferente."
          );
        } else {
          alert(err.response.data.message);
        }
      });
  };

  componentDidMount() {
    this.getAllPlaylist();
  }

  getAllPlaylist = () => {
    axios
      .get(
        "https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists ",
        {
          headers: {
            Authorization: "kethreen-lanes-cruz"
          }
        }
      )
      .then((res) => {
        this.setState({ playlists: res.data.result.list });
      })
      .catch((err) => {
        console.log("Tente novamente");
      });
  };

  delPlaylist = (play) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluír a Playlist "${play.name}" ?`
      )
    ) {
      axios
        .delete(
          `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${play.id}`,
          {
            headers: {
              Authorization: "kethreen-lanes-cruz"
            }
          }
        )
        .then((res) => {
          this.getAllPlaylist();
        })
        .catch((err) => {
          alert(err.response.data.message, "Tente novamente!");
        });
    }
  };

  // removeTrackFromPlaylist = (tracks) => {
  //   this.setState({ tracksId: tracks.id} );
  //     axios
  //       .delete(
  //         `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlist.id}/tracks/${tracks.id}`,
  //         {
  //           headers: {
  //             Authorization: "kethreen-lanes-cruz"
  //           }
  //         }
  //       )
  //       .then((res) => {
  //         console.log("entrou no delete musica")
  //         this.setState({ screen: "tracks" });
  //         // this.selectPlaylist();
  //       })
  //       .catch((err) => {
  //         console.log("entrou no erro");

  //         alert(err.response.data.message, "Tente novamente!");
  //       });

  // };

  selectPlaylist = (playlist) => {
    this.setState({ playlistId: playlist.id });

    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlist.id}/tracks`,
        {
          headers: {
            Authorization: "kethreen-lanes-cruz"
          }
        }
      )
      .then((res) => {
        this.setState({ tracks: res.data.result.tracks });

        this.setState({ screen: "tracks" });
      })
      .catch((err) => {
        alert(err.response.data.message, "Tente novamente!");
      });
  };
  addMusicsPlaylist = (play) => {
    const body = {
      name: this.state.inputName,
      artist: this.state.inputArtist,
      url: this.state.inputUrl
    };
    axios
      .post(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${this.state.playlistId}/tracks`,
        body,
        {
          headers: {
            Authorization: "kethreen-lanes-cruz"
          }
        }
      )
      .then((res) => {
        this.setState({ inputName: "" });
        this.setState({ inputArtist: "" });
        this.setState({ inputUrl: "" });
      })
      .catch((err) => {
        alert(err.response.data.message, "Tente novamente!");
      });
  };

  render() {
    const screencreatePlaylist = (
      <CreatePlaylist>
        <InputCreate
          placeholder={"Nome da Playlist"}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <BtnScreen onClick={this.createPlaylistUser}>Criar Playlist</BtnScreen>
      </CreatePlaylist>
    );
    const openPlaylist = this.state.tracks.map((tracks) => (
      <TracksPlaylists key={tracks.id}>
        <Tracks>
          <audio controls src={tracks.url} type="audio/mpeg"></audio>
          <TrackSubTitle>{tracks.name} </TrackSubTitle>
          <TrackTitle>{tracks.artist} </TrackTitle>
        </Tracks>
        <BtnScreenList type="button">Retirar Música</BtnScreenList>
      </TracksPlaylists>
    ));

    const allPlaylist = this.state.playlists.map((playlists) => (
      <AllPlaylists key={playlists.id}>
        <Playlist> {playlists.name} </Playlist>
        <BtnScreenList
          type="BtnScreen"
          onClick={() => this.selectPlaylist(playlists)}
        >
          Abrir
        </BtnScreenList>
        <BtnScreenList
          type="BtnScreen"
          onClick={() => this.delPlaylist(playlists)}
        >
          Delete
        </BtnScreenList>
      </AllPlaylists>
    ));

    const addMusics = (
      <AddMusic>
        <InputCreateMusic
          placeholder={"MÚSICA"}
          value={this.state.inputName}
          onChange={this.handleInputChangeName}
        />

        <InputCreateMusic
          placeholder={"ARTISTA"}
          value={this.state.inputArtist}
          onChange={this.handleInputChangeArtist}
        />

        <InputCreateMusic
          placeholder={"URL"}
          value={this.state.inputUrl}
          onChange={this.handleInputChangeUrl}
        />

        <BtnScreenList onClick={this.addMusicsPlaylist}>
          Adicionar na Playlist
        </BtnScreenList>
      </AddMusic>
    );
    const screenCorrect =
      this.state.screen === "CreatePlaylist" ? (
        <BackgroundScreenPlaylist>
          <BannerImgCreatePlaylist
            src={bclabefyfoto}
            alt="banner minhas playlists"
          />
          {screencreatePlaylist}
        </BackgroundScreenPlaylist>
      ) : this.state.screen === "allplaylist" ? (
        <ScreenPlaylist>{allPlaylist}</ScreenPlaylist>
      ) : this.state.screen === "tracks" ? (
        <BackgroundScreenPlaylist>{openPlaylist}</BackgroundScreenPlaylist>
      ) : (
        <BackgroundScreenPlaylist> {addMusics} </BackgroundScreenPlaylist>
      );
    const btnsAllScreen =
      this.state.screen !== "CreatePlaylist" &&
      this.state.screen !== "allplaylist" ? (
        <div>
          <BtnChangeScreens onClick={this.goToPlaylist}>
            Voltar para Playlists
          </BtnChangeScreens>
          <BtnChangeScreens onClick={this.goToCreatePlaylist}>
            Criar Nova Playlist
          </BtnChangeScreens>
        </div>
      ) : this.state.screen === "CreatePlaylist" ? (
        <BtnChangeScreens onClick={this.goToPlaylist}>
          {" "}
          Ver Playlists
        </BtnChangeScreens>
      ) : this.state.screen === "allplaylist" ? (
        <BtnChangeScreens onClick={this.goToCreatePlaylist}>
          Criar Nova Playlist
        </BtnChangeScreens>
      ) : (
        <div> LABEFY </div>
      );

    const btnAddMusics =
      this.state.screen === "tracks" ? (
        <BackgroundScreenPlaylist>
          <BtnChangeScreens onClick={this.goToAddTracks}>
            Add Músicas
          </BtnChangeScreens>
        </BackgroundScreenPlaylist>
      ) : (
        <div> </div>
      );

    return (
      <AppContanier>
        {btnAddMusics}

        <div>{screenCorrect}</div>

        {btnsAllScreen}
      </AppContanier>
    );
  }
}
// CSS STYLED COMPONENTS

const AppContanier = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  background-image: url("https://uploads.codesandbox.io/uploads/user/83f10e9e-c824-40ad-b54a-4c7e42bb5ed8/TXJX-bclabefy.jpg");
  background-size: cover;
  color: white;
  width: 100vw;
  height: 100vh;
`;

const CreatePlaylist = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 2%;
  color: white;
  width: 70vw;
  margin-top: 4%;
  height: 50px;
  background-color: #313131;
  opacity: 0.9;
  box-shadow: inset 0 0 0.1em grey, 0 0 0.4em violet;
`;
const InputCreate = styled.input`
  background-color: #cccaca;
  border-radius: 8px 0 0 8px;
  height: 30px;
  width: 50%;
`;
const BtnScreen = styled.button`
  background-color: #24044a;
  color: white;
  border-radius: 0 8px 8px 0;
  height: 35px;
  font-size: 0.7rem;
  text-transform: uppercase;
  &:hover {
    background: #3d81ff;
  }
`;
const BtnChangeScreens = styled.button`
  background-color: #7f2ac9;
  color: white;
  border-radius: 8px;
  width: 160px;
  height: 40px;
  font-size: 1rem;
  box-shadow: inset 0 0 0.1em grey, 0 0 0.4em violet;
  text-transform: uppercase;
  &:hover {
    background: #4d4552;
  }
`;
const AllPlaylists = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 3%;
  border-radius: 8px;
  padding: 2%;
  align-items: center;
  background-color: #313131;
  opacity: 0.85;
  width: 240px;
  color: white;
`;
const BtnScreenList = styled.button`
  background-color: #24044a;
  color: white;
  border-radius: 8px;
  margin: 1%;
  height: 35px;
  font-size: 0.7rem;
  text-transform: uppercase;
  &:hover {
    background: #3d81ff;
  }
`;
const Playlist = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 8%;
  align-items: center;
  font-size: 1.2rem;
  background-color: #313131;
  color: white;
`;
const TracksPlaylists = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 3%;
  border-radius: 8px;
  padding: 2%;
  align-items: center;
  background-color: #313131;
  width: 300px;
  color: white;
`;
const Tracks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  background-color: #313131;
  width: 300px;
  height: 100px;
  color: white;
`;
const TrackTitle = styled.h2`
  margin: 1%;
`;
const TrackSubTitle = styled.h5`
  margin: 1%;
`;
const InputCreateMusic = styled.input`
  display: flex;
  flex-direction: row;
  background-color: #cccaca;
  border-radius: 8px;
  height: 30px;
  width: 40vw;
`;
const BackgroundScreenPlaylist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
`;
const ScreenPlaylist = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 10%;
  justify-items: center;

  width: 100vw;
`;
const BannerImgCreatePlaylist = styled.img`
  width: 100vw;
  height: 50vh;
  box-shadow: inset 0 0 0.3em gold, 0 0 0.3em violet;
`;
const AddMusic = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 3%;
  border-radius: 8px;
  padding: 2%;
  align-items: center;
  background-color: #313131;
`;
