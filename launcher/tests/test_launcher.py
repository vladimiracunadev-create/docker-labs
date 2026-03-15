import unittest
from pathlib import Path

from launcher.docker_labs_launcher import convert_windows_path_to_docker_desktop, discover_manifest


class LauncherTests(unittest.TestCase):
    def test_convert_windows_path_to_docker_desktop(self):
        converted = convert_windows_path_to_docker_desktop(r"C:\DockerLabs\workspace")
        self.assertEqual(converted, "/run/desktop/mnt/host/c/DockerLabs/workspace")

    def test_discover_manifest_from_repo_layout(self):
        root = Path(__file__).resolve().parents[2]
        workspace_root, manifest_path = discover_manifest(str(root), None)
        self.assertEqual(workspace_root, root)
        self.assertEqual(manifest_path, root / "packaging" / "windows" / "distribution-manifest.json")


if __name__ == "__main__":
    unittest.main()
